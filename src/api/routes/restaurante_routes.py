"""
Rutas API para gestión de restaurantes
"""
from flask import Blueprint, request, jsonify
from api.models import db, Restaurante
from flask_cors import CORS

restaurante_bp = Blueprint('restaurantes', __name__)
CORS(restaurante_bp)


@restaurante_bp.route('', methods=['GET'])
def get_restaurantes():
    """
    Listar todos los restaurantes con filtros opcionales
    Query params: letra (inicial del nombre), ciudad
    """
    letra = request.args.get('letra', '').upper()
    ciudad = request.args.get('ciudad', '').strip()
    
    query = Restaurante.query
    
    # Filtrar por letra inicial
    if letra:
        query = query.filter(Restaurante.nombre.ilike(f'{letra}%'))
    
    # Filtrar por ciudad
    if ciudad:
        query = query.filter(Restaurante.ciudad.ilike(f'%{ciudad}%'))
    
    restaurantes = query.order_by(Restaurante.nombre).all()
    
    return jsonify([r.serialize() for r in restaurantes]), 200


@restaurante_bp.route('/<int:id>', methods=['GET'])
def get_restaurante(id):
    """Obtener un restaurante por ID"""
    restaurante = Restaurante.query.get(id)
    
    if not restaurante:
        return jsonify({'error': 'Restaurante no encontrado'}), 404
    
    return jsonify(restaurante.serialize()), 200


@restaurante_bp.route('', methods=['POST'])
def create_restaurante():
    """Crear un nuevo restaurante"""
    data = request.get_json()
    
    # Validaciones
    if not data.get('nombre'):
        return jsonify({'error': 'El nombre es requerido'}), 400
    if not data.get('direccion'):
        return jsonify({'error': 'La dirección es requerida'}), 400
    if not data.get('ciudad'):
        return jsonify({'error': 'La ciudad es requerida'}), 400
    
    restaurante = Restaurante(
        nombre=data['nombre'],
        descripcion=data.get('descripcion', ''),
        direccion=data['direccion'],
        ciudad=data['ciudad'],
        foto_url=data.get('foto_url', '')
    )
    
    db.session.add(restaurante)
    db.session.commit()
    
    return jsonify(restaurante.serialize()), 201


@restaurante_bp.route('/<int:id>', methods=['PUT'])
def update_restaurante(id):
    """Actualizar un restaurante existente"""
    restaurante = Restaurante.query.get(id)
    
    if not restaurante:
        return jsonify({'error': 'Restaurante no encontrado'}), 404
    
    data = request.get_json()
    
    # Actualizar campos si se proporcionan
    if 'nombre' in data:
        restaurante.nombre = data['nombre']
    if 'descripcion' in data:
        restaurante.descripcion = data['descripcion']
    if 'direccion' in data:
        restaurante.direccion = data['direccion']
    if 'ciudad' in data:
        restaurante.ciudad = data['ciudad']
    if 'foto_url' in data:
        restaurante.foto_url = data['foto_url']
    
    db.session.commit()
    
    return jsonify(restaurante.serialize()), 200


@restaurante_bp.route('/<int:id>', methods=['DELETE'])
def delete_restaurante(id):
    """Eliminar un restaurante"""
    restaurante = Restaurante.query.get(id)
    
    if not restaurante:
        return jsonify({'error': 'Restaurante no encontrado'}), 404
    
    db.session.delete(restaurante)
    db.session.commit()
    
    return jsonify({'message': 'Restaurante eliminado correctamente'}), 200


@restaurante_bp.route('/ciudades', methods=['GET'])
def get_ciudades():
    """Obtener lista de ciudades únicas para filtros"""
    ciudades = db.session.query(Restaurante.ciudad).distinct().order_by(Restaurante.ciudad).all()
    return jsonify([c[0] for c in ciudades]), 200
