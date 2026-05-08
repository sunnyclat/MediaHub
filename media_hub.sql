-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 07-05-2026 a las 03:11:54
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `media_hub`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `content`
--

CREATE TABLE `content` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `release_year` int(11) DEFAULT NULL,
  `type` enum('movie','series','game') NOT NULL,
  `cover_url` varchar(300) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `featured` tinyint(1) DEFAULT 0,
  `poster_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `content`
--

INSERT INTO `content` (`id`, `user_id`, `title`, `description`, `release_year`, `type`, `cover_url`, `created_at`, `featured`, `poster_path`) VALUES
(1, 1, 'Interstellar', 'Viaje espacial y ciencia.', 2014, 'movie', NULL, '2025-12-08 15:47:51', 1, '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'),
(2, 1, 'The Witcher 3', 'RPG mundo abierto (fantasía).', 2015, 'game', NULL, '2025-12-08 15:47:51', 1, '/5VW4HR4kOWU7teKb4DySHwSwfrA.jpg'),
(3, NULL, 'Breaking Bad', 'Profesor → imperio criminal (drama).', 2008, 'series', NULL, '2025-12-08 15:47:51', 1, '/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg'),
(4, NULL, 'The Shawshank Redemption', 'Two imprisoned men bond over years while seeking redemption and hope.', 1994, 'movie', NULL, '2026-03-12 16:55:28', 0, '/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg'),
(5, NULL, 'Fight Club', 'An office worker forms an underground fight club that spirals into chaos.', 1999, 'movie', NULL, '2026-03-12 16:55:28', 0, '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg'),
(6, NULL, 'The Social Network', 'The story behind the creation of Facebook and the lawsuits that followed.', 2010, 'movie', NULL, '2026-03-12 16:55:28', 0, '/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg'),
(7, NULL, 'The Witcher', 'Geralt of Rivia navigates a brutal fantasy world filled with monsters and magic.', 2019, 'series', NULL, '2026-03-12 16:55:28', 0, '/AoGsDM02UVt0npBA8OvpDcZbaMi.jpg'),
(8, NULL, 'The Boys', 'A group of vigilantes set out to take down corrupt superheroes.', 2019, 'series', NULL, '2026-03-12 16:55:28', 0, '/in1R2dDc421JxsoRWaIIAqVI2KE.jpg'),
(9, NULL, 'Chernobyl', 'A dramatization of the catastrophic nuclear disaster in the Soviet Union.', 2019, 'series', NULL, '2026-03-12 16:55:28', 0, '/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg'),
(10, NULL, 'Better Call Saul', 'The rise of lawyer Jimmy McGill before becoming Saul Goodman.', 2015, 'series', NULL, '2026-03-12 16:55:28', 0, NULL),
(11, NULL, 'Halo Infinite', 'Master Chief returns to face a new threat in the Halo universe.', 2021, 'game', NULL, '2026-03-12 16:55:28', 0, NULL),
(12, NULL, 'Mass Effect 2', 'Commander Shepard must assemble a team to stop an alien threat.', 2010, 'game', NULL, '2026-03-12 16:55:28', 0, NULL),
(13, NULL, 'Skyrim', 'An open world RPG where the Dragonborn must defeat ancient dragons.', 2011, 'game', NULL, '2026-03-12 16:55:28', 0, '/8h1mltqNC5l0qCn1aAdQIVM4jNn.jpg'),
(14, NULL, 'BioShock', 'A man discovers the underwater dystopian city of Rapture.', 2007, 'game', NULL, '2026-03-12 16:55:28', 0, NULL),
(15, NULL, 'Metal Gear Solid V', 'A tactical espionage game following the story of Venom Snake.', 2015, 'game', NULL, '2026-03-12 16:55:28', 0, NULL),
(16, NULL, 'The Office', 'A mockumentary about everyday life in an office.', 2005, 'series', NULL, '2026-03-12 16:55:28', 0, '/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg'),
(17, NULL, 'Parasite', 'A poor family infiltrates the lives of a wealthy household.', 2019, 'movie', NULL, '2026-03-12 16:55:28', 0, '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg'),
(18, NULL, 'Gladiator', 'A Roman general seeks revenge after betrayal.', 2000, 'movie', NULL, '2026-03-12 16:55:28', 0, '/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg'),
(19, NULL, 'The Godfather', 'The powerful Italian-American crime family led by Vito Corleone.', 1972, 'movie', NULL, '2026-03-12 16:55:28', 0, '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg'),
(20, NULL, 'Pulp Fiction', 'Multiple crime stories intertwine in Los Angeles.', 1994, 'movie', NULL, '2026-03-12 16:55:28', 0, NULL),
(21, NULL, 'Dune', 'A noble family becomes embroiled in a war for control of the desert planet Arrakis.', 2021, 'movie', NULL, '2026-03-12 17:48:17', 0, '/gDzOcq0pfeCeqMBwKIJlSmQpjkZ.jpg'),
(22, NULL, 'Severance', 'Employees undergo a procedure that separates their work memories from their personal lives.', 2022, 'series', NULL, '2026-03-12 17:48:17', 0, NULL),
(23, NULL, 'Hollow Knight', 'A lone knight explores a vast underground kingdom filled with mysterious creatures.', 2017, 'game', NULL, '2026-03-12 17:48:17', 0, NULL),
(24, NULL, 'Inception', 'A skilled thief steals secrets from within the subconscious during dreams.', 2010, 'movie', NULL, '2026-03-12 16:52:21', 0, '/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg'),
(25, NULL, 'The Dark Knight', 'Batman faces the Joker, a criminal mastermind who plunges Gotham into chaos.', 2008, 'movie', NULL, '2026-03-12 16:52:21', 0, '/qJ2tW6WMUDux911r6m7haRef0WH.jpg'),
(26, NULL, 'Red Dead Redemption 2', 'An outlaw struggles to survive as the Wild West fades away.', 2018, 'game', NULL, '2026-03-12 16:52:21', 0, NULL),
(27, NULL, 'Cyberpunk 2077', 'A mercenary named V navigates the dangerous futuristic city of Night City.', 2020, 'game', NULL, '2026-03-12 16:52:21', 0, '/x865gFd84x8lWuU55FONLuKFKIV.jpg'),
(28, NULL, 'God of War', 'Kratos embarks on a journey through the Norse realms with his son Atreus.', 2018, 'game', NULL, '2026-03-12 16:52:21', 0, '/4rWq9Vwb1gVhQIqkhUKE0hPVwnz.jpg'),
(29, NULL, 'Stranger Things', 'A group of kids encounter supernatural forces and secret government experiments.', 2016, 'series', NULL, '2026-03-12 16:52:21', 0, '/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg'),
(30, NULL, 'The Last of Us', 'Two survivors travel across a devastated America after a fungal apocalypse.', 2013, 'game', NULL, '2026-03-12 16:52:21', 0, '/72vtlHQiSZtUnQMdCaBT7BJlfya.jpg'),
(31, NULL, 'Game of Thrones', 'Noble families fight for control of the Iron Throne in a brutal medieval fantasy world.', 2011, 'series', NULL, '2026-03-12 16:52:21', 0, '/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg'),
(32, NULL, 'Blade Runner 2049', 'A replicant hunter uncovers a secret that could change society forever.', 2017, 'movie', NULL, '2026-03-12 16:52:21', 0, '/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg'),
(33, NULL, 'The Matrix', 'A hacker discovers that reality is actually a simulation controlled by machines.', 1999, 'movie', NULL, '2026-03-12 16:52:21', 0, '/p96dm7sCMn4VYAStA6siNz30G1r.jpg'),
(34, NULL, 'Half-Life 2', 'Scientist Gordon Freeman leads the resistance against alien occupation.', 2004, 'game', NULL, '2026-03-12 16:52:21', 0, '/67ZrzCB9DWJ4riXfbGKByDWJjN1.jpg'),
(35, NULL, 'Portal 2', 'A puzzle game involving portals and a sarcastic AI named GLaDOS.', 2011, 'game', NULL, '2026-03-12 16:52:21', 0, NULL),
(36, NULL, 'Elden Ring', 'An open world fantasy adventure created by FromSoftware and George R. R. Martin.', 2022, 'game', NULL, '2026-03-12 16:52:21', 0, '/3ApvUAl0aw6TKKLkJH3IrEzPpIf.jpg'),
(37, NULL, 'The Mandalorian', 'A bounty hunter protects a mysterious child in the Star Wars universe.', 2019, 'series', NULL, '2026-03-12 16:52:21', 0, '/7QujwMB124KqSPbWlLRHBO5wygE.jpg'),
(38, NULL, 'The Lord of the Rings', 'A fellowship journeys to destroy a powerful ring before evil conquers the world.', 2001, 'movie', NULL, '2026-03-12 16:52:21', 0, '/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg'),
(39, NULL, 'Star Wars', 'A galactic conflict between rebels and an evil empire unfolds across space.', 1977, 'movie', NULL, '2026-03-12 16:52:21', 0, '/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg'),
(40, NULL, 'Dark', 'A time travel mystery unfolds in a small German town.', 2017, 'series', NULL, '2026-03-12 16:52:21', 0, '/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg'),
(52, NULL, 'The Hollow Men', 'Matthew comes to a seaside town to see a performance of his play, although even his brother Marc, who plays the role of Napoleon, does not know that Metthew is its author. Also in life Marc plays \"Napoleon\", becoming the leader of a group of local youth.', 1993, 'movie', NULL, '2026-03-25 19:12:41', 0, '/58D9D85o57AMN1jmGupverE5PZF.jpg'),
(53, NULL, 'Sleepy Hollow', 'Skeptical young detective Ichabod Crane gets transferred to the hamlet of Sleepy Hollow, New York, where he is tasked with investigating the decapitations of three people – murders the townsfolk attribute to a legendary specter, The Headless Horseman.', 1999, 'movie', NULL, '2026-03-25 19:12:49', 0, '/1GuK965FLJxqUw9fd1pmvjbFAlv.jpg'),
(55, NULL, 'Chernobyl\'s ghosts', 'An italian crew interviews some old people living in the exclusion zone around Chernobyl\'s nuclear power plant.', 2020, 'movie', NULL, '2026-03-25 19:13:42', 0, '/16oe5EyQtSGKmUNrTycJZHfocYg.jpg'),
(69, NULL, 'The Gladiators', 'Some time in the future, East and West have stopped maintaining standing armies and nuclear weapons. Instead, to settle their differences they pit different teams of crack combat specialists against each other.', 1969, 'movie', NULL, '2026-04-02 03:21:08', 0, '/cYSRNwxQl2zWJWGjWqAS3RjtLls.jpg'),
(71, NULL, 'Codigo Horizonte', 'Un equipo de analistas investiga senales imposibles que aparecen en satelites fuera de servicio.', 2019, 'series', NULL, '2026-04-16 16:50:20', 0, ''),
(75, NULL, 'Barrio Central', 'Cinco familias enfrentan alianzas y traiciones mientras un nuevo lider intenta controlar el vecindario.', 2022, 'series', NULL, '2026-04-16 16:50:20', 0, ''),
(77, NULL, 'Luna 7', 'La rutina de una base minera cambia cuando una senal de auxilio llega desde un tunel sellado.', 2023, 'series', NULL, '2026-04-16 16:50:20', 0, ''),
(79, NULL, 'Casa de Cristal', 'Una dinastia poderosa lucha por mantener su imperio despues de una misteriosa desaparicion.', 2021, 'series', NULL, '2026-04-16 16:50:20', 0, ''),
(89, NULL, 'Distrito Delta', 'Una unidad policial experimental intenta imponer orden en un sector abandonado por el Estado.', 2021, 'series', NULL, '2026-04-16 16:50:20', 0, '/gr2YG3hbasg5IKWncVJbjXoYscr.jpg'),
(96, NULL, 'Reloj de Arena', 'Un historiador recibe artefactos que parecen cambiar pequeños eventos del pasado.', 2015, 'movie', NULL, '2026-04-16 16:50:20', 0, ''),
(97, NULL, 'Linea de Fuego', 'Bomberos y rescatistas arriesgan todo durante una temporada marcada por incendios imposibles.', 2020, 'series', NULL, '2026-04-16 16:50:20', 0, ''),
(99, NULL, 'Mercado Negro', 'En una ciudad futurista, comerciantes clandestinos trafican recuerdos digitales.', 2023, 'series', NULL, '2026-04-16 16:50:20', 0, ''),
(100, NULL, 'Tormenta Blanca', 'Un equipo de rescate alpino enfrenta una avalancha provocada por intereses corporativos.', 2014, 'movie', NULL, '2026-04-16 16:50:20', 0, ''),
(102, NULL, 'El Umbral', 'Una psicologa forense investiga casos conectados por suenos identicos entre las victimas.', 2019, 'movie', NULL, '2026-04-16 16:50:20', 0, ''),
(106, NULL, 'Pacto de Lobos', 'Dos enemigos se unen para sobrevivir a una persecucion que recorre toda la capital.', 2001, 'movie', NULL, '2026-04-16 16:50:20', 0, '/Ahd4F7azhjsxgXYjVyFmVzJu9LB.jpg'),
(107, NULL, 'Colonia Sur', 'Pioneros y cientificos sostienen una comunidad aislada mientras una amenaza crece bajo tierra.', 2020, 'series', NULL, '2026-04-16 16:50:20', 0, ''),
(108, NULL, 'Vidas Prestadas', 'Un abogado descubre que sus nuevos clientes comparten identidades fabricadas.', 2018, 'movie', NULL, '2026-04-16 16:50:20', 0, ''),
(110, NULL, 'Tren Nocturno', 'Una violinista y un exsoldado cruzan el pais persiguiendo a una sociedad secreta.', 2015, 'movie', NULL, '2026-04-16 16:50:20', 0, ''),
(113, NULL, 'Costa Salvaje', 'Guardaparques, pescadores y turistas chocan cuando aparecen criaturas desconocidas en la bahia.', 2022, 'series', NULL, '2026-04-16 16:50:20', 0, ''),
(114, NULL, 'Punto Ciego', 'Un fiscal obsesionado sigue una pista que lo lleva hasta la estructura mas alta del poder.', 2019, 'movie', NULL, '2026-04-16 16:50:20', 0, ''),
(126, NULL, 'Avatar', 'Un exmarine llega a un mundo alienigena y termina atrapado entre dos civilizaciones.', 2009, 'movie', NULL, '2026-04-16 16:57:36', 0, ''),
(127, NULL, 'The Last of Us', 'Dos sobrevivientes recorren un mundo devastado mientras buscan una ultima esperanza.', 2023, 'series', NULL, '2026-04-16 16:57:36', 0, ''),
(128, NULL, 'Titanic', 'Un romance imposible nace a bordo del transatlantico mas famoso de la historia.', 1997, 'movie', NULL, '2026-04-16 16:57:36', 0, ''),
(129, NULL, 'The Walking Dead', 'Un grupo de sobrevivientes intenta mantenerse con vida en medio de un apocalipsis zombi.', 2010, 'series', NULL, '2026-04-16 16:57:36', 0, ''),
(132, NULL, 'Mad Max: Fury Road', 'Una persecucion salvaje atraviesa el desierto en un mundo sin leyes ni agua.', 2015, 'movie', NULL, '2026-04-16 16:57:36', 0, ''),
(134, NULL, 'Joker', 'Un comediante frustrado cae en una espiral de violencia y caos en Gotham.', 2019, 'movie', NULL, '2026-04-16 16:57:36', 0, ''),
(139, NULL, 'Wednesday', 'La hija de la familia Addams investiga asesinatos y secretos en una academia peculiar.', 2022, 'series', NULL, '2026-04-16 16:57:36', 0, ''),
(140, NULL, 'John Wick', 'Un asesino retirado vuelve al submundo criminal tras sufrir una perdida devastadora.', 2014, 'movie', NULL, '2026-04-16 16:57:36', 0, ''),
(141, NULL, 'Sherlock', 'Una version moderna del detective mas famoso del mundo y su inseparable companero.', 2010, 'series', NULL, '2026-04-16 16:57:36', 0, ''),
(143, NULL, 'Friends', 'Seis amigos atraviesan el amor, el trabajo y la adultez en Nueva York.', 1994, 'series', NULL, '2026-04-16 16:57:36', 0, ''),
(144, NULL, 'Avengers: Endgame', 'Los heroes restantes intentan revertir la derrota mas grande de su historia.', 2019, 'movie', NULL, '2026-04-16 16:57:36', 0, ''),
(146, NULL, 'Whiplash', 'Un joven baterista entra en conflicto con un exigente e implacable instructor.', 2014, 'movie', NULL, '2026-04-16 16:57:36', 0, ''),
(147, NULL, 'Black Mirror', 'Historias independientes exploran el lado mas oscuro de la tecnologia moderna.', 2011, 'series', NULL, '2026-04-16 16:57:36', 0, ''),
(148, NULL, 'La La Land', 'Una actriz y un musico persiguen sus suenos mientras su relacion cambia con el exito.', 2016, 'movie', NULL, '2026-04-16 16:57:36', 0, ''),
(149, NULL, 'Peaky Blinders', 'Una familia criminal intenta expandir su poder en la Birmingham de posguerra.', 2013, 'series', NULL, '2026-04-16 16:57:36', 0, ''),
(151, NULL, 'Narcos', 'La serie sigue el ascenso y la persecucion de los grandes carteles de la droga.', 2015, 'series', NULL, '2026-04-16 16:57:36', 0, ''),
(153, NULL, 'House of the Dragon', 'La casa Targaryen se fractura por una guerra de sucesion marcada por fuego y sangre.', 2022, 'series', NULL, '2026-04-16 16:57:36', 0, ''),
(155, NULL, 'True Detective', 'Detectives de distintas epocas enfrentan casos que dejan marcas profundas.', 2014, 'series', NULL, '2026-04-16 16:57:36', 0, ''),
(157, NULL, 'The Crown', 'La monarquia britanica es retratada a traves de conflictos politicos y personales.', 2016, 'series', NULL, '2026-04-16 16:57:36', 0, ''),
(160, NULL, 'Forrest Gump', 'La vida de un hombre sencillo termina cruzandose con momentos clave de la historia reciente.', 1994, 'movie', NULL, '2026-04-16 16:57:36', 0, ''),
(161, NULL, 'Loki', 'El dios del engano queda atrapado en una agencia que vigila las lineas del tiempo.', 2021, 'series', NULL, '2026-04-16 16:57:36', 0, ''),
(162, NULL, 'The Lord of the Rings: The Fellowship of the Ring', 'Un grupo improbable inicia una travesia para destruir un objeto de enorme poder.', 2001, 'movie', NULL, '2026-04-16 16:57:36', 0, ''),
(165, NULL, 'The Bear', 'Un chef vuelve a casa para salvar el negocio familiar mientras enfrenta su propio caos.', 2022, 'series', NULL, '2026-04-16 16:57:36', 0, ''),
(166, NULL, 'Oppenheimer', 'La pelicula retrata el desarrollo de la bomba atomica y el peso moral de su creador.', 2023, 'movie', NULL, '2026-04-16 16:57:36', 0, ''),
(167, NULL, 'Euphoria', 'Adolescentes buscan identidad y afecto mientras atraviesan excesos y heridas emocionales.', 2019, 'series', NULL, '2026-04-16 16:57:36', 0, ''),
(168, NULL, 'Spider-Man: Into the Spider-Verse', 'Miles Morales descubre que no es el unico Spider-Man del multiverso.', 2018, 'movie', NULL, '2026-04-16 16:57:36', 0, ''),
(169, NULL, 'Arcane', 'La rivalidad entre dos ciudades y dos hermanas desata un conflicto inolvidable.', 2021, 'series', NULL, '2026-04-16 16:57:36', 0, ''),
(170, NULL, 'The Prestige', 'Dos ilusionistas rivales llevan su obsesion por el mejor truco hasta consecuencias extremas.', 2006, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(171, NULL, 'The Sopranos', 'Un jefe mafioso intenta equilibrar el crimen organizado con su vida familiar y su terapia.', 1999, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(172, NULL, 'The Departed', 'Un policia infiltrado y un topo de la mafia se buscan mutuamente dentro del mismo juego.', 2006, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(173, NULL, 'Lost', 'Los sobrevivientes de un accidente aereo descubren que la isla es mucho mas peligrosa de lo que parece.', 2004, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(174, NULL, 'Se7en', 'Dos detectives siguen el rastro de un asesino serial que usa los siete pecados capitales como firma.', 1995, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(175, NULL, 'House', 'Un medico brillante y dificil resuelve los casos mas complejos con metodos poco convencionales.', 2004, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(176, NULL, 'Alien', 'La tripulacion de una nave comercial se enfrenta a una criatura letal en medio del espacio.', 1979, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(177, NULL, 'Prison Break', 'Un hombre entra voluntariamente en prision para sacar a su hermano de una condena injusta.', 2005, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(178, NULL, 'Aliens', 'Ripley regresa al planeta de la pesadilla acompañando a un escuadron de marines coloniales.', 1986, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(179, NULL, 'Dexter', 'Un forense especializado en sangre lleva una doble vida como asesino de criminales.', 2006, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(180, NULL, 'The Silence of the Lambs', 'Una joven agente del FBI busca la ayuda de un brillante y peligroso canibal para atrapar a otro asesino.', 1991, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(181, NULL, 'Sons of Anarchy', 'Un club de motociclistas criminales protege su territorio mientras se desgarra por dentro.', 2008, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(182, NULL, 'Saving Private Ryan', 'Un grupo de soldados recibe una mision imposible en plena Segunda Guerra Mundial.', 1998, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(183, NULL, 'Suits', 'Un abogado brillante sin titulo logra entrar a un estudio prestigioso ocultando su secreto.', 2011, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(184, NULL, 'The Green Mile', 'Un guardia de prision conoce a un condenado con un don sobrenatural inesperado.', 1999, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(185, NULL, 'The Wire', 'La serie retrata el crimen, la politica y las instituciones de Baltimore con una mirada cruda.', 2002, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(186, NULL, 'Schindler\'s List', 'Un empresario oportunista termina salvando cientos de vidas durante el Holocausto.', 1993, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(187, NULL, 'Mr. Robot', 'Un hacker solitario se une a una revolucion digital contra el sistema financiero.', 2015, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(188, NULL, 'The Lion King', 'Un joven leon debe asumir su lugar en el reino despues de una tragedia familiar.', 1994, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(189, NULL, 'Westworld', 'Un parque tematico futurista pierde el control de sus anfitriones artificiales.', 2016, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(190, NULL, 'Toy Story', 'Los juguetes cobran vida cuando nadie los mira y enfrentan la llegada de un nuevo favorito.', 1995, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(191, NULL, 'Mindhunter', 'Dos agentes del FBI estudian asesinos seriales para entender como piensan.', 2017, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(192, NULL, 'Coco', 'Un nino viaja al mundo de los muertos para descubrir la verdad sobre su familia y su musica.', 2017, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(193, NULL, 'Ozark', 'Una familia se muda a los lagos de Missouri para lavar dinero para un cartel.', 2017, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(194, NULL, 'Up', 'Un viudo emprende una aventura aerea con una casa sostenida por globos y un companero inesperado.', 2009, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(195, NULL, 'The Handmaid\'s Tale', 'En una dictadura teocratica, una mujer intenta sobrevivir y resistir.', 2017, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(196, NULL, 'WALL-E', 'Un pequeno robot recolector de basura descubre una nueva razon para cuidar el futuro.', 2008, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(197, NULL, 'Succession', 'Una familia multimillonaria se enfrenta por el control de un imperio mediatico.', 2018, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(198, NULL, 'Spirited Away', 'Una nena entra en un mundo espiritual y debe encontrar la manera de salvar a sus padres.', 2001, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(199, NULL, 'Severance', 'Empleados de una empresa separan sus recuerdos laborales y personales con un procedimiento inquietante.', 2022, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(200, NULL, 'Princess Mononoke', 'Un joven guerrero queda atrapado en una lucha entre la naturaleza y la ambicion humana.', 1997, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(201, NULL, 'The White Lotus', 'Un resort de lujo sirve de escenario para tensiones, privilegios y conflictos ocultos.', 2021, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(202, NULL, 'Your Name.', 'Dos adolescentes conectados por un misterio imposible cambian la vida del otro sin conocerse.', 2016, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(203, NULL, 'Fargo', 'Crimenes absurdos y personajes memorables se cruzan en historias marcadas por el frio y la violencia.', 2014, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(204, NULL, 'Oldboy', 'Un hombre liberado tras anos de cautiverio busca respuestas y venganza.', 2003, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(205, NULL, 'The Americans', 'Dos espias sovieticos viven infiltrados como una familia comun en Estados Unidos.', 2013, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(206, NULL, 'The Pianist', 'Un musico judio intenta sobrevivir a la destruccion de Varsovia durante la guerra.', 2002, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(207, NULL, 'Hannibal', 'Un investigador y un psiquiatra brillante desarrollan una relacion tan fascinante como peligrosa.', 2013, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(208, NULL, 'The Grand Budapest Hotel', 'Las aventuras de un conserje legendario y su protegido se mezclan con un crimen y una herencia.', 2014, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(209, NULL, 'The Haunting of Hill House', 'Una familia marcada por una mansion embrujada enfrenta traumas del pasado y del presente.', 2018, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(210, NULL, 'No Country for Old Men', 'Un hallazgo fortuito arrastra a varios hombres a una persecucion brutal en la frontera.', 2007, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(211, NULL, 'La Casa de Papel', 'Un grupo de delincuentes ejecuta un asalto imposible bajo el plan de un cerebro maestro.', 2017, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(212, NULL, 'Prisoners', 'La desaparicion de dos nenas empuja a un padre desesperado mas alla de todos los limites.', 2013, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(213, NULL, 'Attack on Titan', 'La humanidad sobrevive detras de murallas mientras gigantes devoradores amenazan su existencia.', 2013, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(214, NULL, 'Arrival', 'Una linguista intenta comunicarse con visitantes extraterrestres que llegan sin previo aviso.', 2016, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(215, NULL, 'Death Note', 'Un estudiante obtiene un cuaderno capaz de matar y decide imponer su propia justicia.', 2006, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(216, NULL, 'Sicario', 'Una agente idealista entra en una guerra secreta contra el narcotrafico en la frontera.', 2015, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(217, NULL, 'Fullmetal Alchemist: Brotherhood', 'Dos hermanos alquimistas buscan recuperar lo que perdieron tras un intento prohibido.', 2009, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(218, NULL, 'Her', 'Un hombre solitario establece una relacion profunda con un sistema operativo inteligente.', 2013, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(219, NULL, 'One Piece', 'Un joven pirata de goma se lanza al mar en busca del tesoro mas legendario.', 1999, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(220, NULL, 'Gone Girl', 'La desaparicion de una mujer convierte a su matrimonio en un espectaculo oscuro y retorcido.', 2014, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(221, NULL, 'Bleach', 'Un adolescente obtiene poderes sobrenaturales y asume el trabajo de proteger almas y combatir monstruos.', 2004, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(222, NULL, 'The Revenant', 'Un cazador dado por muerto recorre territorios salvajes decidido a sobrevivir y vengarse.', 2015, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(223, NULL, 'Vinland Saga', 'Un joven guerrero crece en medio de la guerra y la sed de venganza en tiempos vikingos.', 2019, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(224, NULL, 'Logan', 'Un heroe cansado protege a una nina perseguida mientras enfrenta su ultimo gran viaje.', 2017, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(225, NULL, 'Cowboy Bebop', 'Un grupo de cazarrecompensas viaja por el espacio arrastrando viejas heridas y deudas.', 1998, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(226, NULL, 'Deadpool', 'Un mercenario transforma su tragedia en una venganza irreverente y violenta.', 2016, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(227, NULL, 'Rick and Morty', 'Un cientifico brillante y desastroso arrastra a su nieto a aventuras por todo el multiverso.', 2013, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(228, NULL, 'The Batman', 'Bruce Wayne investiga una serie de crimenes que revelan la corrupcion profunda de Gotham.', 2022, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(229, NULL, 'BoJack Horseman', 'Una vieja estrella de television intenta llenar el vacio de su vida entre fama, culpa y humor.', 2014, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(230, NULL, 'Top Gun: Maverick', 'Un piloto legendario vuelve a entrenar a una nueva generacion para una mision de alto riesgo.', 2022, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(231, NULL, 'Brooklyn Nine-Nine', 'Detectives muy distintos comparten casos, amistad y caos en una comisaria de Nueva York.', 2013, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(232, NULL, 'Mission: Impossible - Fallout', 'Ethan Hunt enfrenta una nueva crisis global cuando una operacion sale mal.', 2018, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(233, NULL, 'Parks and Recreation', 'Una funcionaria optimista intenta mejorar su ciudad con ideas imposibles y mucho entusiasmo.', 2009, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(234, NULL, 'Casino Royale', 'James Bond enfrenta su primera gran prueba en una partida decisiva de poker y espionaje.', 2006, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(235, NULL, 'Community', 'Un grupo de estudiantes inadaptados convierte una universidad comunitaria en una aventura constante.', 2009, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(236, NULL, 'Skyfall', 'Bond vuelve al servicio cuando el pasado de M amenaza con destruir todo a su paso.', 2012, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(237, NULL, 'Modern Family', 'Tres ramas de una familia viven situaciones cotidianas con humor, caos y carino.', 2009, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(238, NULL, 'Shutter Island', 'Dos agentes investigan una desaparicion en un hospital psiquiatrico aislado.', 2010, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(239, NULL, 'How I Met Your Mother', 'Un padre le cuenta a sus hijos la larga historia de como conocio a su madre.', 2005, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(240, NULL, 'Heat', 'Un policia obsesionado y un ladron profesional se enfrentan en una ciudad que no duerme.', 1995, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(241, NULL, 'Scrubs', 'Un grupo de medicos jovenes enfrenta la presion del hospital con comedia y emocion.', 2001, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(242, NULL, 'Kill Bill: Vol. 1', 'Una asesina despierta del coma y comienza a tachar nombres de su lista de venganza.', 2003, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(243, NULL, 'Ted Lasso', 'Un entrenador de futbol americano llega a Inglaterra para dirigir un club sin saber casi nada del deporte.', 2020, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(244, NULL, 'Inglourious Basterds', 'Un grupo de soldados judios busca sembrar terror entre los nazis en la Francia ocupada.', 2009, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(245, NULL, 'The Good Place', 'Una mujer descubre que la vida despues de la muerte tiene reglas tan absurdas como estrictas.', 2016, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(246, NULL, 'Django Unchained', 'Un esclavo liberado se une a un cazador de recompensas para rescatar a su esposa.', 2012, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(247, NULL, 'Fleabag', 'Una mujer brillante e impulsiva enfrenta el dolor y el deseo con humor filoso.', 2016, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(248, NULL, 'Once Upon a Time... in Hollywood', 'Un actor en decadencia y su doble viven el final de una epoca en Los Angeles.', 2019, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(249, NULL, 'Killing Eve', 'Una agente del MI5 y una asesina internacional desarrollan una peligrosa fascinacion mutua.', 2018, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(250, NULL, 'The Truman Show', 'Un hombre descubre que toda su vida ha sido transmitida como un programa de television.', 1998, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(251, NULL, 'The Leftovers', 'El mundo intenta seguir adelante despues de una desaparicion global sin explicacion.', 2014, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(252, NULL, 'Eternal Sunshine of the Spotless Mind', 'Una pareja recorre sus recuerdos mientras intenta borrarse mutuamente de la memoria.', 2004, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(253, NULL, 'Boardwalk Empire', 'Politica, crimen y negocios se mezclan durante la ley seca en Atlantic City.', 2010, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(254, NULL, 'Back to the Future', 'Un adolescente viaja accidentalmente al pasado y pone en riesgo su propia existencia.', 1985, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(255, NULL, 'Band of Brothers', 'La miniserie sigue a una compania de paracaidistas desde el entrenamiento hasta el fin de la guerra.', 2001, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(256, NULL, 'Jurassic Park', 'Un parque con dinosaurios clonados se convierte rapidamente en una trampa mortal.', 1993, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(257, NULL, 'The Pacific', 'La guerra en el frente del Pacifico es contada desde la experiencia de varios marines.', 2010, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(258, NULL, 'The Sixth Sense', 'Un psicologo infantil atiende a un nino que afirma ver personas muertas.', 1999, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(259, NULL, 'Mr. Bean', 'El torpe y silencioso protagonista convierte cualquier situacion cotidiana en un desastre inolvidable.', 1990, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(260, NULL, 'A Quiet Place', 'Una familia sobrevive en silencio absoluto mientras criaturas letales cazan por el sonido.', 2018, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(261, NULL, 'Avatar: The Last Airbender', 'Un joven maestro del aire debe restaurar el equilibrio entre naciones en guerra.', 2005, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(262, NULL, 'Get Out', 'La visita a la familia de una novia revela un horror tan elegante como perturbador.', 2017, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(263, NULL, 'Daredevil', 'Un abogado ciego combate el crimen de noche con una intensidad brutal.', 2015, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(264, NULL, 'The Conjuring', 'Dos investigadores paranormales afrontan uno de los casos mas aterradores de su carrera.', 2013, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(265, NULL, 'Jessica Jones', 'Una detective con fuerza sobrehumana enfrenta traumas y amenazas de su pasado.', 2015, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(266, NULL, 'Ford v Ferrari', 'Dos visionarios del automovilismo intentan vencer a Ferrari en la carrera mas exigente del mundo.', 2019, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(267, NULL, 'Andor', 'La serie sigue la radicalizacion de un hombre comun dentro de la rebelion contra el Imperio.', 2022, 'series', NULL, '2026-04-16 17:37:44', 0, ''),
(268, NULL, 'Knives Out', 'Un detective investiga la muerte de un escritor rodeado de familiares sospechosos.', 2019, 'movie', NULL, '2026-04-16 17:37:44', 0, ''),
(269, NULL, 'The Penguin', 'El ascenso criminal de Oz Cobb transforma el submundo de Gotham tras una gran caida del poder.', 2024, 'series', NULL, '2026-04-16 17:37:44', 0, '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `content_genres`
--

CREATE TABLE `content_genres` (
  `id` int(11) NOT NULL,
  `content_id` int(11) NOT NULL,
  `genre_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `content_genres`
--

INSERT INTO `content_genres` (`id`, `content_id`, `genre_id`) VALUES
(1, 1, 6),
(2, 2, 4),
(3, 3, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `content_likes`
--

CREATE TABLE `content_likes` (
  `content_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `content_likes`
--

INSERT INTO `content_likes` (`content_id`, `user_id`, `created_at`) VALUES
(6, 2, '2026-04-14 21:32:28'),
(33, 2, '2026-04-14 21:30:57'),
(53, 2, '2026-04-14 21:30:34');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `content_platforms`
--

CREATE TABLE `content_platforms` (
  `id` int(11) NOT NULL,
  `content_id` int(11) NOT NULL,
  `platform_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `content_platforms`
--

INSERT INTO `content_platforms` (`id`, `content_id`, `platform_id`) VALUES
(1, 2, 1),
(2, 3, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `episodes`
--

CREATE TABLE `episodes` (
  `id` int(11) NOT NULL,
  `season_id` int(11) NOT NULL,
  `episode_number` int(11) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `release_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `episodes`
--

INSERT INTO `episodes` (`id`, `season_id`, `episode_number`, `title`, `release_date`) VALUES
(1, 1, 1, 'Pilot', NULL),
(2, 1, 2, 'Cat\'s in the Bag', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `genres`
--

CREATE TABLE `genres` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `genres`
--

INSERT INTO `genres` (`id`, `name`) VALUES
(1, 'Acción'),
(2, 'Aventura'),
(5, 'Drama'),
(4, 'RPG'),
(6, 'Sci-Fi'),
(3, 'Terror');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `platforms`
--

CREATE TABLE `platforms` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `platforms`
--

INSERT INTO `platforms` (`id`, `name`) VALUES
(4, 'Netflix'),
(1, 'PC'),
(5, 'Prime Video'),
(2, 'PS5'),
(3, 'Xbox');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ratings`
--

CREATE TABLE `ratings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content_id` int(11) NOT NULL,
  `score` tinyint(4) NOT NULL,
  `review` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `saved_content`
--

CREATE TABLE `saved_content` (
  `user_id` int(11) NOT NULL,
  `content_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `saved_content`
--

INSERT INTO `saved_content` (`user_id`, `content_id`, `created_at`) VALUES
(1, 1, '2026-04-06 19:50:42'),
(1, 2, '2026-04-06 19:50:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seasons`
--

CREATE TABLE `seasons` (
  `id` int(11) NOT NULL,
  `content_id` int(11) NOT NULL,
  `season_number` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `seasons`
--

INSERT INTO `seasons` (`id`, `content_id`, `season_number`) VALUES
(1, 3, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'sunny', 'samsoad@gmail.com', '$2a$10$.M4Q7/W4tSNwsnOWXJUkr.lx8.QanpeUSPUU.8O8WlE1A8MpO4pi2', 'user', '2026-04-02 03:48:53'),
(2, 'roam', 'roda@gmail.com', '$2a$10$3mvi/eMX46Ntz7P0PYkRK.PmY.w4P36NmYekBlVIutiCzWPKBhCh6', 'user', '2026-04-14 18:42:09'),
(3, 'sadeo', 'sadeo@gmail.com', '$2a$10$zpR29FXpgNQ1.JIpavelnuEYUorxkQ3E.WXmqMwltg.t.cqJW4vyS', 'user', '2026-04-16 15:22:52'),
(4, 'admin', 'luduenasamuell@gmail.com', '$2a$10$9yRnR11j4Gh9hf9VcyU4N.wdF11M4jOPNKT3ojECLIaC3S/YE7OCK', 'admin', '2026-04-16 16:09:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_activity`
--

CREATE TABLE `user_activity` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `action` varchar(50) NOT NULL,
  `content_id` int(11) DEFAULT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payload`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user_activity`
--

INSERT INTO `user_activity` (`id`, `user_id`, `type`, `action`, `content_id`, `payload`, `created_at`) VALUES
(1, 1, 'content', 'created', 1, '{\"source\": \"seed\"}', '2026-04-06 19:50:42'),
(2, 1, 'content', 'saved', 1, '{\"source\": \"seed\"}', '2026-04-06 19:50:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_follows`
--

CREATE TABLE `user_follows` (
  `user_id` int(11) NOT NULL,
  `followed_user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user_follows`
--

INSERT INTO `user_follows` (`user_id`, `followed_user_id`, `created_at`) VALUES
(1, 2, '2026-04-14 18:45:37');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `content`
--
ALTER TABLE `content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_content_user_id` (`user_id`);

--
-- Indices de la tabla `content_genres`
--
ALTER TABLE `content_genres`
  ADD PRIMARY KEY (`id`),
  ADD KEY `content_id` (`content_id`),
  ADD KEY `genre_id` (`genre_id`);

--
-- Indices de la tabla `content_likes`
--
ALTER TABLE `content_likes`
  ADD PRIMARY KEY (`content_id`,`user_id`),
  ADD KEY `fk_content_likes_user` (`user_id`);

--
-- Indices de la tabla `content_platforms`
--
ALTER TABLE `content_platforms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `content_id` (`content_id`),
  ADD KEY `platform_id` (`platform_id`);

--
-- Indices de la tabla `episodes`
--
ALTER TABLE `episodes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `season_id` (`season_id`);

--
-- Indices de la tabla `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_fav` (`user_id`,`content_id`),
  ADD KEY `content_id` (`content_id`);

--
-- Indices de la tabla `genres`
--
ALTER TABLE `genres`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `platforms`
--
ALTER TABLE `platforms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_user_content` (`user_id`,`content_id`),
  ADD KEY `content_id` (`content_id`);

--
-- Indices de la tabla `saved_content`
--
ALTER TABLE `saved_content`
  ADD PRIMARY KEY (`user_id`,`content_id`),
  ADD KEY `fk_saved_content_content` (`content_id`);

--
-- Indices de la tabla `seasons`
--
ALTER TABLE `seasons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `content_id` (`content_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `user_activity`
--
ALTER TABLE `user_activity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_activity_user` (`user_id`),
  ADD KEY `fk_user_activity_content` (`content_id`);

--
-- Indices de la tabla `user_follows`
--
ALTER TABLE `user_follows`
  ADD PRIMARY KEY (`user_id`,`followed_user_id`),
  ADD KEY `fk_user_follows_followed` (`followed_user_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `content`
--
ALTER TABLE `content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=270;

--
-- AUTO_INCREMENT de la tabla `content_genres`
--
ALTER TABLE `content_genres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `content_platforms`
--
ALTER TABLE `content_platforms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `episodes`
--
ALTER TABLE `episodes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `genres`
--
ALTER TABLE `genres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `platforms`
--
ALTER TABLE `platforms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `seasons`
--
ALTER TABLE `seasons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `user_activity`
--
ALTER TABLE `user_activity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `content`
--
ALTER TABLE `content`
  ADD CONSTRAINT `fk_content_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `content_genres`
--
ALTER TABLE `content_genres`
  ADD CONSTRAINT `content_genres_ibfk_1` FOREIGN KEY (`content_id`) REFERENCES `content` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `content_genres_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `content_likes`
--
ALTER TABLE `content_likes`
  ADD CONSTRAINT `fk_content_likes_content` FOREIGN KEY (`content_id`) REFERENCES `content` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_content_likes_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `content_platforms`
--
ALTER TABLE `content_platforms`
  ADD CONSTRAINT `content_platforms_ibfk_1` FOREIGN KEY (`content_id`) REFERENCES `content` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `content_platforms_ibfk_2` FOREIGN KEY (`platform_id`) REFERENCES `platforms` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `episodes`
--
ALTER TABLE `episodes`
  ADD CONSTRAINT `episodes_ibfk_1` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`content_id`) REFERENCES `content` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`content_id`) REFERENCES `content` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `saved_content`
--
ALTER TABLE `saved_content`
  ADD CONSTRAINT `fk_saved_content_content` FOREIGN KEY (`content_id`) REFERENCES `content` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_saved_content_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `seasons`
--
ALTER TABLE `seasons`
  ADD CONSTRAINT `seasons_ibfk_1` FOREIGN KEY (`content_id`) REFERENCES `content` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_activity`
--
ALTER TABLE `user_activity`
  ADD CONSTRAINT `fk_user_activity_content` FOREIGN KEY (`content_id`) REFERENCES `content` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_activity_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `user_follows`
--
ALTER TABLE `user_follows`
  ADD CONSTRAINT `fk_user_follows_followed` FOREIGN KEY (`followed_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_follows_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
