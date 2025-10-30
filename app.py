# -*- coding: utf-8 -*-
from flask import Flask, jsonify, request
from flask_cors import CORS
from db_config import get_connection
import bcrypt

app = Flask(__name__)
CORS(app)  # permite peticiones desde el frontend

# === PRODUCTOS ===
@app.route('/api/productos')
def get_productos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM productos")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

# === EMPLEADOS ===
@app.route('/api/empleados')
def get_empleados():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM empleados")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

# === VENTAS ===
@app.route('/api/ventas')
def get_ventas():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT v.id_venta, p.nombre AS producto, e.nombre AS empleado, v.cantidad, v.fecha
        FROM ventas v
        JOIN productos p ON v.id_producto = p.id_producto
        JOIN empleados e ON v.id_empleado = e.id_empleado
        ORDER BY v.fecha DESC
    """)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

# === REGISTRO DE USUARIO ===
@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    nombre = data.get('nombre')
    apellido = data.get('apellido')
    email = data.get('email')
    usuario = data.get('usuario')
    password = data.get('password')

    if not all([nombre, email, usuario, password]):
        return jsonify({"error": "Faltan datos obligatorios"}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Verificar si ya existe el usuario o email
    cursor.execute("SELECT * FROM usuarios WHERE usuario=%s OR email=%s", (usuario, email))
    existente = cursor.fetchone()
    if existente:
        cursor.close()
        conn.close()
        return jsonify({"error": "El usuario o correo ya existen"}), 409

    # Encriptar contraseña
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    cursor.execute("""
        INSERT INTO usuarios (nombre, apellido, email, usuario, password)
        VALUES (%s, %s, %s, %s, %s)
    """, (nombre, apellido, email, usuario, hashed_pw))

    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensaje": "Usuario creado correctamente"}), 201

# === LOGIN DE USUARIO ===
@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()
    usuario = data.get('usuario')
    password = data.get('password')

    if not usuario or not password:
        return jsonify({"error": "Faltan credenciales"}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios WHERE usuario=%s", (usuario,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        # No devolvemos la contraseña
        return jsonify({
            "mensaje": "Inicio de sesión exitoso",
            "usuario": {
                "id": user["id_usuario"],
                "nombre": user["nombre"],
                "rol": user.get("rol", "cliente")
            }
        })
    else:
        return jsonify({"error": "Usuario o contraseña incorrectos"}), 401


if __name__ == '__main__':
    app.run(debug=True)
