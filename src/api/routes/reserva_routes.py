"""
Rutas API para gestión de reservas
"""
from flask import Blueprint, request, jsonify
from api.models import db, Reserva, Restaurante
from flask_cors import CORS

reserva_bp = Blueprint('reservas', __name__)
CORS(reserva_bp)

# Constantes de negocio
MESAS_POR_RESTAURANTE = 15
MAX_RESERVAS_DIA_RESTAURANTE = 15
MAX_RESERVAS_DIA_TOTAL = 20


def get_mesas_ocupadas(restaurante_id, fecha):
    """Obtiene todas las mesas ocupadas para un restaurante en una fecha"""
    reservas = Reserva.query.filter_by(
        restaurante_id=restaurante_id,
        fecha=fecha
    ).all()
    
    mesas_ocupadas = []
    for r in reservas:
        mesas_ocupadas.extend(r.get_mesas_list())
    
    return mesas_ocupadas


def contar_mesas_reservadas_dia(fecha):
    """Cuenta el total de mesas reservadas en un día (todas las reservas)"""
    reservas = Reserva.query.filter_by(fecha=fecha).all()
    total = 0
    for r in reservas:
        total += len(r.get_mesas_list())
    return total


@reserva_bp.route('', methods=['GET'])
def get_reservas():
    """Listar todas las reservas"""
    reservas = Reserva.query.order_by(Reserva.fecha.desc(), Reserva.id.desc()).all()
    return jsonify([r.serialize() for r in reservas]), 200


@reserva_bp.route('/<int:id>', methods=['GET'])
def get_reserva(id):
    """Obtener una reserva por ID"""
    reserva = Reserva.query.get(id)
    
    if not reserva:
        return jsonify({'error': 'Reserva no encontrada'}), 404
    
    return jsonify(reserva.serialize()), 200


@reserva_bp.route('', methods=['POST'])
def create_reserva():
    """
    Crear una nueva reserva con múltiples mesas
    Validaciones:
    - Máximo 15 mesas/día por restaurante
    - Máximo 20 mesas/día en total
    - Mesas deben estar entre 1-15
    - Mesas no deben estar ocupadas ese día en ese restaurante
    """
    data = request.get_json()
    
    # Validaciones básicas
    if not data.get('restaurante_id'):
        return jsonify({'error': 'El restaurante es requerido'}), 400
    if not data.get('fecha'):
        return jsonify({'error': 'La fecha es requerida'}), 400
    if not data.get('mesas'):
        return jsonify({'error': 'Debe seleccionar al menos una mesa'}), 400
    if not data.get('cliente_nombre'):
        return jsonify({'error': 'El nombre del cliente es requerido'}), 400
    
    restaurante_id = data['restaurante_id']
    fecha = data['fecha']
    cliente_nombre = data['cliente_nombre']
    
    # Convertir mesas a lista
    if isinstance(data['mesas'], list):
        mesas_solicitadas = [int(m) for m in data['mesas']]
    else:
        mesas_solicitadas = [int(m) for m in str(data['mesas']).split(',') if m]
    
    if not mesas_solicitadas:
        return jsonify({'error': 'Debe seleccionar al menos una mesa'}), 400
    
    # Validar que el restaurante existe
    restaurante = Restaurante.query.get(restaurante_id)
    if not restaurante:
        return jsonify({'error': 'Restaurante no encontrado'}), 404
    
    # Validar números de mesa (1-15)
    for mesa in mesas_solicitadas:
        if mesa < 1 or mesa > MESAS_POR_RESTAURANTE:
            return jsonify({'error': f'El número de mesa {mesa} debe estar entre 1 y {MESAS_POR_RESTAURANTE}'}), 400
    
    # Verificar si alguna mesa ya está reservada ese día en ese restaurante
    mesas_ocupadas = get_mesas_ocupadas(restaurante_id, fecha)
    mesas_conflicto = [m for m in mesas_solicitadas if m in mesas_ocupadas]
    
    if mesas_conflicto:
        if len(mesas_conflicto) == 1:
            return jsonify({'error': f'La mesa {mesas_conflicto[0]} ya está reservada para esa fecha'}), 400
        else:
            return jsonify({'error': f'Las mesas {", ".join(map(str, mesas_conflicto))} ya están reservadas para esa fecha'}), 400
    
    # Contar mesas del día para ese restaurante
    mesas_restaurante = len(mesas_ocupadas)
    if mesas_restaurante + len(mesas_solicitadas) > MAX_RESERVAS_DIA_RESTAURANTE:
        disponibles = MAX_RESERVAS_DIA_RESTAURANTE - mesas_restaurante
        return jsonify({'error': f'Solo quedan {disponibles} mesas disponibles en este restaurante para ese día'}), 400
    
    # Contar mesas totales del día (todos los restaurantes)
    mesas_totales = contar_mesas_reservadas_dia(fecha)
    if mesas_totales + len(mesas_solicitadas) > MAX_RESERVAS_DIA_TOTAL:
        disponibles = MAX_RESERVAS_DIA_TOTAL - mesas_totales
        return jsonify({'error': f'Solo quedan {disponibles} mesas disponibles en total para ese día'}), 400
    
    # Crear la reserva con múltiples mesas
    mesas_str = ','.join(map(str, sorted(mesas_solicitadas)))
    reserva = Reserva(
        restaurante_id=restaurante_id,
        fecha=fecha,
        mesas=mesas_str,
        cliente_nombre=cliente_nombre
    )
    
    db.session.add(reserva)
    db.session.commit()
    
    return jsonify(reserva.serialize()), 201


@reserva_bp.route('/<int:id>', methods=['DELETE'])
def delete_reserva(id):
    """Cancelar una reserva"""
    reserva = Reserva.query.get(id)
    
    if not reserva:
        return jsonify({'error': 'Reserva no encontrada'}), 404
    
    db.session.delete(reserva)
    db.session.commit()
    
    return jsonify({'message': 'Reserva cancelada correctamente'}), 200


@reserva_bp.route('/disponibilidad/<int:restaurante_id>/<fecha>', methods=['GET'])
def get_disponibilidad(restaurante_id, fecha):
    """
    Obtener mesas disponibles para un restaurante en una fecha
    Retorna las mesas ocupadas y disponibles
    """
    # Verificar que el restaurante existe
    restaurante = Restaurante.query.get(restaurante_id)
    if not restaurante:
        return jsonify({'error': 'Restaurante no encontrado'}), 404
    
    # Obtener mesas reservadas ese día
    mesas_ocupadas = get_mesas_ocupadas(restaurante_id, fecha)
    mesas_disponibles = [i for i in range(1, MESAS_POR_RESTAURANTE + 1) if i not in mesas_ocupadas]
    
    # Verificar límite total del día
    mesas_totales = contar_mesas_reservadas_dia(fecha)
    limite_alcanzado = mesas_totales >= MAX_RESERVAS_DIA_TOTAL
    
    return jsonify({
        'restaurante_id': restaurante_id,
        'fecha': fecha,
        'mesas_ocupadas': mesas_ocupadas,
        'mesas_disponibles': mesas_disponibles,
        'mesas_reservadas_restaurante': len(mesas_ocupadas),
        'mesas_totales_dia': mesas_totales,
        'limite_dia_alcanzado': limite_alcanzado
    }), 200
