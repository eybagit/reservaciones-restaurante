from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Integer, Text, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()


class Restaurante(db.Model):
    """Modelo para restaurantes"""
    __tablename__ = 'restaurantes'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    descripcion: Mapped[str] = mapped_column(Text, nullable=True)
    direccion: Mapped[str] = mapped_column(String(200), nullable=False)
    ciudad: Mapped[str] = mapped_column(String(100), nullable=False)
    foto_url: Mapped[str] = mapped_column(String(500), nullable=True)
    
    # Relación con reservas
    reservas = relationship('Reserva', backref='restaurante', lazy=True, cascade='all, delete-orphan')
    
    def serialize(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'direccion': self.direccion,
            'ciudad': self.ciudad,
            'foto_url': self.foto_url
        }


class Reserva(db.Model):
    """Modelo para reservas de mesa"""
    __tablename__ = 'reservas'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    restaurante_id: Mapped[int] = mapped_column(ForeignKey('restaurantes.id'), nullable=False)
    fecha: Mapped[str] = mapped_column(String(10), nullable=False)  # YYYY-MM-DD
    mesas: Mapped[str] = mapped_column(String(50), nullable=False)  # Comma-separated: "1,3,5"
    cliente_nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    
    def get_mesas_list(self):
        """Retorna lista de números de mesa"""
        return [int(m) for m in self.mesas.split(',') if m]
    
    def serialize(self):
        return {
            'id': self.id,
            'restaurante_id': self.restaurante_id,
            'restaurante_nombre': self.restaurante.nombre if self.restaurante else None,
            'fecha': self.fecha,
            'mesas': self.get_mesas_list(),
            'mesas_str': self.mesas,
            'cliente_nombre': self.cliente_nombre
        }