
import click
from api.models import db, Restaurante, Reserva

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    
    """ 
    Command to insert test restaurants
    Run: $ flask insert-test-restaurants 3
    """
    @app.cli.command("insert-test-restaurants")
    @click.argument("count")
    def insert_test_restaurants(count):
        print("Creating test restaurants")
        ciudades = ["Bogotá", "Medellín", "Cali"]
        for x in range(1, int(count) + 1):
            restaurante = Restaurante(
                nombre=f"Restaurante Test {x}",
                descripcion=f"Descripción del restaurante de prueba {x}",
                direccion=f"Calle {x} # {x}-{x}",
                ciudad=ciudades[(x-1) % len(ciudades)],
                foto_url=f"https://picsum.photos/400/300?random={x}"
            )
            db.session.add(restaurante)
            db.session.commit()
            print(f"Restaurante: {restaurante.nombre} created.")
        print("All test restaurants created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        """Insert sample data for testing"""
        # Insert sample restaurants
        restaurantes_data = [
            {
                "nombre": "La Casa del Sabor",
                "descripcion": "Comida tradicional colombiana con el mejor sazón",
                "direccion": "Calle 72 # 10-15",
                "ciudad": "Bogotá",
                "foto_url": "https://picsum.photos/400/300?random=1"
            },
            {
                "nombre": "Mar Azul",
                "descripcion": "Los mejores mariscos de la costa",
                "direccion": "Carrera 5 # 25-30",
                "ciudad": "Cartagena",
                "foto_url": "https://picsum.photos/400/300?random=2"
            },
            {
                "nombre": "El Rincón Paisa",
                "descripcion": "Bandeja paisa y platos típicos antioqueños",
                "direccion": "Avenida 80 # 45-12",
                "ciudad": "Medellín",
                "foto_url": "https://picsum.photos/400/300?random=3"
            }
        ]
        
        for data in restaurantes_data:
            restaurante = Restaurante(**data)
            db.session.add(restaurante)
        
        db.session.commit()
        print("Test data inserted successfully!")