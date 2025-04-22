CREATE DATABASE arenafutebolbr;
USE arenafutebolbr;

CREATE TABLE Jogos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  time_casa VARCHAR(50),
  time_fora VARCHAR(50),
  data DATE,
  placar_casa INT,
  placar_fora INT
);

CREATE TABLE Palpites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(255),
  foto_perfil VARCHAR(255),
  palpite VARCHAR(255),
  pontos INT DEFAULT 0
);

INSERT INTO Jogos 
(time_casa, time_fora, data, placar_casa, placar_fora, campeonato, estadio, placas) 
VALUES 
('Corinthians', 'São Paulo', '2025-04-18', 1, 1, 'Paulistão', 'Neo Química Arena', 'Nike, Coca-Cola');



