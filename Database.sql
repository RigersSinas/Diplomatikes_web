-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Εξυπηρετητής: localhost
-- Χρόνος δημιουργίας: 21 Ιουν 2025 στις 15:09:17
-- Έκδοση διακομιστή: 10.4.28-MariaDB
-- Έκδοση PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Βάση δεδομένων: `Database`
--

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `Assessments`
--

CREATE TABLE `Assessments` (
  `assessment_id` int(11) NOT NULL,
  `project_ref` int(11) NOT NULL,
  `sched_date` date NOT NULL,
  `sched_time` time NOT NULL,
  `mode` enum('onsite','remote') NOT NULL,
  `room` varchar(255) DEFAULT NULL,
  `meeting_url` varchar(2083) DEFAULT NULL,
  `notice_title` varchar(255) DEFAULT NULL,
  `notice_body` text DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `modified_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `Assessments`
--

INSERT INTO `Assessments` (`assessment_id`, `project_ref`, `sched_date`, `sched_time`, `mode`, `room`, `meeting_url`, `notice_title`, `notice_body`, `created_on`, `modified_on`) VALUES
(3, 28, '2025-06-21', '17:00:00', 'remote', NULL, 'https://www.youtube.com/', NULL, NULL, '2025-06-14 10:48:05', '2025-06-14 10:48:05'),
(4, 31, '2025-06-20', '17:00:00', 'onsite', 'Αίθουσα 1', NULL, NULL, NULL, '2025-06-14 14:35:14', '2025-06-14 14:35:14'),
(5, 30, '2025-06-21', '17:00:00', 'onsite', 'Αίθουσα 1', NULL, NULL, NULL, '2025-06-14 14:38:05', '2025-06-14 14:38:05'),
(6, 39, '2025-06-21', '10:00:00', 'onsite', 'Αίθουσα 1', NULL, NULL, NULL, '2025-06-19 19:44:07', '2025-06-19 19:44:07'),
(7, 40, '2025-06-26', '10:00:00', 'onsite', 'Αίθουσα 1', NULL, NULL, NULL, '2025-06-21 10:23:44', '2025-06-21 12:06:32');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `Professors`
--

CREATE TABLE `Professors` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `topic` varchar(255) DEFAULT NULL,
  `landline` varchar(20) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `university` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `Professors`
--

INSERT INTO `Professors` (`id`, `username`, `password`, `name`, `surname`, `email`, `topic`, `landline`, `mobile`, `department`, `university`) VALUES
(1, 'andreas', '0000', 'Andreas', 'Komninos', 'akomninos@ceid.upatras.gr', 'Network-centric systems', '2610996915', '6977998877', 'CEID', 'University of Patras'),
(7, 'vasilis', '0000', 'Vasilis', 'Foukaras', 'vasfou@ceid.upatras.gr', 'Integrated Systems', '2610885511', '6988812345', 'CEID', 'University of Patras'),
(8, 'basilis', '0000', 'Basilis', 'Karras', 'karras@nterti.com', 'Artificial Intelligence', '23', '545', 'CEID', 'University of Patras'),
(9, 'eleni1', '0000', 'Eleni', 'Voyiatzaki', 'eleni@ceid.gr', 'WEB', '34', '245', 'CEID', 'University of Patras'),
(10, 'andrew', '0000', 'Andrew', 'Hozier Byrne', 'hozier@ceid.upatras.gr', 'Artificial Intelligence', '2610170390', '6917031990', 'CEID', 'University of Patras'),
(11, 'nikos', '0000', 'Nikos', 'Georgiou', 'nikos.korobos12@gmail.com', 'Data Engineering', '2610324365', '6978530352', 'IT', 'University of Patras'),
(12, 'kostas', '0000', 'Kostas', 'Kalantas', 'kostkaranik@gmail.com', 'informatics', '2610324242', '6934539920', 'CEID', 'University of Patras'),
(13, 'mpampis', '0000', 'Mpampis', 'Sougias', 'mpampis123@gmail.com', 'Arxeologia', '2610945934', '6947845334', 'Arxeologias', 'UOI'),
(14, 'daskalos', '0000', 'Daskalos', 'Makaveli', 'makavelibet@gmail.com', 'Business', '2310231023', '6929349285', 'Economics', 'UOA'),
(15, 'maria', '0000', 'Maria', 'Papadopoulou', 'palam@upatras.gr', 'SQL injections', '1234567890', '6988223322', 'Engineering', 'University of SKG'),
(16, 'meni', '0000', 'Meni', 'Talaiporimeni', 'meniT@upatras.gr', 't', '2610333999', '6999990999', 'CEID', 'UoP'),
(17, 'tzouli', '0000', 'Tzouli', 'Alexandratou', 'tzouli.ax@upatras.gr', 'Big Data', '2264587412', '6996116921', 'CEID', 'University of Patras'),
(18, 'karikhs', '0000', 'Karikhs', 'Raftel', 'karikhs@yahoo.gr', 'Pharmaceutical Drugs', '69', '6945258923', 'Chemistry', 'University of Streets'),
(19, 'vlasis', '0000', 'Vlasis', 'Restas', 'toxrusoftiari@funerals.gr', 'Nekro8aftiki', '78696910', '69696964', 'Nekro8aftikis', 'University Of Ohio'),
(20, 'fat', '0000', 'Fat ', 'Banker', 'fatbanker@kapitalas.gr', 'kippah', '6942014121', '6969784205', 'Froutemporiki', 'University of Israel'),
(21, 'hamze', '0000', 'Hamze', 'Mohamed', 'info@hamzat.gr', 'Logistics', '1245789513', '1456983270', 'Social Rehabitation', 'University of UAE'),
(22, 'stefania', '0000', 'Stefania', 'Nikolaou', 'snikolaou@upatras.gr', 'Information Theory', '2106723456', '6942323452', 'ECE', 'University of Patras'),
(23, 'petros', '0000', 'Petros', 'Danezis', 'pdanezis@upatras.gr', 'Telecommunication Electronics', '2610908888', '6971142424', 'ECE', 'University of Patras	'),
(24, 'papadopoulos', '0000', 'Papadopoulos ', 'Eustathios', 'eustratiospap@gmail.com', 'Physics', '210-1234567', '690-1234567', 'Physics', 'National and Kapodistrian University of Athens'),
(25, 'konstantinou', '0000', 'Konstantinou', 'Maria', 'mariakon@gmail.com', 'Statistics and Probability', '2310-7654321', '694-7654321', 'Mathematics', 'Aristotle University of Thessaloniki'),
(26, 'jim', '0000', 'Jim', 'Nikolaou', 'jimnik@gmail.com', 'Artificial Intelligence', '2610-9876543', '697-9876543', 'Computer Science', 'University of Patras'),
(27, 'sophia', '0000', 'Sophia', 'Michailidi', 'sophiamich@gmail.com', 'Economic Theory', '2310-5432109', '698-5432109', 'Economics', 'Athens University of Economics and Business'),
(28, 'michael', '0000', 'Michael ', 'Papadreou', 'michaelpap@gmail.com', 'Renewable Energy Systems', '2610-4455667', '697-4455667', 'Electrical Engineering', 'University of Ioannina'),
(29, 'elon', '0000', 'Elon', 'Musk', 'elonmusk@gmail.com', 'Electric Vehicles', '1-888-518-3752', 'Null', 'Department of Physics', 'University of Pennsylvania, Philadelphia'),
(32, 'giorgis', '0000', 'Giorgis', 'Fousekis', 'abcdefg@example.com', 'topic', 'land', 'mob', 'dep', 'university'),
(34, 'patrick', '0000', 'patrick', 'xrusopsaros', 'patric@xrusopsaros.com', 'thalasioi ipopotamoi', '2610567917', '6952852742', 'Solomos', 'Nemo'),
(35, 'paraskevas', '0000', 'Paraskevas', 'koutsikos', 'paraskevas@kobres.ath', 'Provata', '2298042035', '6969696969', 'Ktinotrofia', 'University of Methana'),
(36, 'ezio', '0000', 'Ezio', 'Auditore da Firenze', 'masterassassin@upatras.ceid.gr', 'assassinations', 'null', 'null', 'Monterigioni', 'University of Assasinos'),
(37, 'sotiris', '0000', 'Sotiris', 'Panaikas', 'spana@hotmail.com', 'Bet Predictions', '1235654899', '2310521010', 'opap', 'London'),
(38, 'anitta', '0000', 'Anitta', 'Wynn', 'anittamaxwynn@cashmoney.com', 'Probability', '2610486396', '698888884', 'Computer Engineering', 'University of Beegwean'),
(39, 'joseluis', '0000', 'Jose Luis', 'Mendilibar', 'goatmanager@thrylos.gr', 'Sentres', '2105555555', '6922222222', 'Conference League', 'Uni of Olympiacos'),
(40, 'liam', '0000', 'Liam', 'Payne', 'liampayne@ceid.upatras.gr', 'Cryptography', '2462311345', '6980847234', 'CEID', 'University of Patras'),
(41, 'zayn', '0000', 'Zayn', 'Malik', 'zaynmalik@gmail.com', 'Oriented programing', '2310221234', '6971006355', 'CEID', 'University of Patras'),
(43, 'oikoumenikos', '0000', 'Oikoumenikos', 'Prasinos', 'mavros@bbs.af', 'Nikolakos', '987546123', '69 6 9 69', 'Ougantiani Filosofia', 'Nation University Of Pakistan'),
(44, 'severus', '0000', 'Severus', 'Snape', 'ihatepotter@hocusmail.com', 'math 2', '26210 26441', '6926626226', 'ceid', 'University of Patras'),
(45, 'tungtung', '0000', 'Tung Tung', 'Sahur', 'tungtungtung@itbr.com', 'Graphs', '210 1425735', '69434619363', 'CEID', 'University of Patras'),
(48, 'mari', '0000', 'MARI', 'BRO', 'mari-bro@beast.com', 'Life', '666', '666', 'no', 'University of Brain'),
(49, 'ahrefhttpswwwyoutubecomga', '0000', '<a href=\"https://www.youtube.com\">G</a>', 'Goat', 'goat@messi.cr', 'no', '666', '666', 'No', 'University of Goats'),
(50, 'brain', '0000', 'Brain', 'Rot', 'capucapu@ccino.assassino', 'no', '9', '6', 'Brainrot', '<a href=\"https://www.youtube.com/watch?v=nxSbhVnwdFw&t=1121s\">Crocodilo</a>'),
(51, 'giannis', '0000', 'Giannis ', 'Sinsidis', 'johnusins@upatras.gr', 'Ypsiloikardiakoipalmoi', '2610645698', '697878787', 'Palindromikis kiniseos', 'University of Makias'),
(52, 'giorgos', '0000', 'Giorgos', 'Fragkofonias', 'georgeNofragka@utsipis.gr', 'oikonomia tou tsipi', '2610546132', '697878787', 'Real Economics ', 'University Of Empty Pocket'),
(53, 'ioannis', '0000', 'Ioannis', 'Tsilis', 'tsilis@tsilliuniversity.gr', 'Iliopoulos to fainomeno', '2610212121', '6921212121', 'Tsili Kafeneio', 'University of the Road'),
(54, 'prasinos', '0000', 'Prasinos ', 'Frouros', 'prasinosfrouros@gmail.com', 'alafouzo poula', '261056458', '698778788', 'Panathinaiki agwgh', 'University of tears'),
(55, 'giorgio', '0000', 'Giorgio ', 'Bonassera', 'Gbonassera@gmail.com', 'spagetti aldente', '23131131', '6575754', 'cuccina italiana', 'Carbonara University');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `ProjectInvites`
--

CREATE TABLE `ProjectInvites` (
  `invite_id` int(11) NOT NULL,
  `project_ref` int(11) NOT NULL,
  `professor_invited` int(11) NOT NULL,
  `invite_status` enum('pending','accepted','rejected','cancelled') DEFAULT 'pending',
  `sent_on` datetime DEFAULT current_timestamp(),
  `updated_on` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `ProjectInvites`
--

INSERT INTO `ProjectInvites` (`invite_id`, `project_ref`, `professor_invited`, `invite_status`, `sent_on`, `updated_on`) VALUES
(7, 22, 24, 'cancelled', '2025-06-07 11:31:29', '2025-06-07 11:54:54'),
(8, 22, 11, 'cancelled', '2025-06-07 11:31:51', '2025-06-07 11:54:54'),
(9, 22, 28, 'cancelled', '2025-06-07 11:32:08', '2025-06-07 11:54:54'),
(11, 22, 22, 'cancelled', '2025-06-07 11:36:04', '2025-06-07 11:54:54'),
(12, 22, 7, 'accepted', '2025-06-07 11:40:05', '2025-06-07 11:54:26'),
(13, 22, 8, 'accepted', '2025-06-07 11:54:47', '2025-06-07 11:54:54'),
(14, 28, 11, 'cancelled', '2025-06-09 21:05:10', '2025-06-09 21:19:34'),
(15, 28, 9, 'cancelled', '2025-06-09 21:15:34', '2025-06-09 21:19:34'),
(16, 28, 7, 'accepted', '2025-06-09 21:18:49', '2025-06-09 21:19:02'),
(17, 28, 10, 'accepted', '2025-06-09 21:19:28', '2025-06-09 21:19:34'),
(18, 30, 9, 'accepted', '2025-06-14 16:51:47', '2025-06-14 16:59:50'),
(19, 30, 10, 'accepted', '2025-06-14 16:51:51', '2025-06-14 17:00:05'),
(20, 30, 11, 'cancelled', '2025-06-14 16:51:58', '2025-06-14 17:00:05'),
(21, 31, 9, 'rejected', '2025-06-14 17:01:33', '2025-06-14 17:01:46'),
(22, 31, 10, 'pending', '2025-06-14 17:01:37', '2025-06-14 17:01:37'),
(23, 35, 9, 'accepted', '2025-06-14 19:11:40', '2025-06-14 19:12:02'),
(24, 35, 10, 'accepted', '2025-06-14 19:11:44', '2025-06-14 19:12:25'),
(25, 39, 9, 'accepted', '2025-06-19 22:16:11', '2025-06-19 22:16:34'),
(26, 39, 10, 'accepted', '2025-06-19 22:16:23', '2025-06-19 22:16:43'),
(27, 40, 9, 'accepted', '2025-06-21 12:07:35', '2025-06-21 12:16:53'),
(28, 40, 10, 'accepted', '2025-06-21 12:17:24', '2025-06-21 12:17:32');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `ProjectLinks`
--

CREATE TABLE `ProjectLinks` (
  `id` int(11) NOT NULL,
  `project_ref` int(11) NOT NULL,
  `url` text NOT NULL,
  `added_on` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `ProjectLinks`
--

INSERT INTO `ProjectLinks` (`id`, `project_ref`, `url`, `added_on`) VALUES
(1, 28, 'https://www.youtube.com/', '2025-06-14 12:19:48'),
(7, 28, 'http://localhost/web_2025/project-pdfs/draft_684d41f92988f1.50350383_my-invoice__1_.pdf', '2025-06-14 13:01:18'),
(8, 31, 'https://www.youtube.com/', '2025-06-14 17:34:35'),
(9, 35, 'http://localhost/web_2025/pages/student-page.html', '2025-06-14 19:44:03'),
(10, 35, 'https://eclass.upatras.gr/', '2025-06-14 19:44:11'),
(11, 39, 'https://colorhunt.co/', '2025-06-19 22:48:30'),
(12, 39, 'https://www.youtube.com/', '2025-06-19 22:51:00');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `ProjectLogs`
--

CREATE TABLE `ProjectLogs` (
  `log_id` int(11) NOT NULL,
  `project_ref` int(11) NOT NULL,
  `event` varchar(50) NOT NULL,
  `actor_id` int(11) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `logged_on` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `ProjectLogs`
--

INSERT INTO `ProjectLogs` (`log_id`, `project_ref`, `event`, `actor_id`, `details`, `logged_on`) VALUES
(2, 38, 'project_created', NULL, 'Νέο topic δημιουργήθηκε', '2025-06-19 20:34:26'),
(3, 39, 'project_created', NULL, 'Νέο topic δημιουργήθηκε', '2025-06-19 22:15:20'),
(4, 40, 'project_created', NULL, 'Νέο topic δημιουργήθηκε', '2025-06-21 11:52:54'),
(5, 41, 'project_created', NULL, 'Νέο topic δημιουργήθηκε', '2025-06-21 12:00:59'),
(6, 42, 'project_created', NULL, 'Νέο topic δημιουργήθηκε', '2025-06-21 15:32:14');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `ProjectMeta`
--

CREATE TABLE `ProjectMeta` (
  `meta_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `summary` text NOT NULL,
  `attachment` text DEFAULT NULL,
  `draft_attachment` text DEFAULT NULL,
  `resources` text DEFAULT NULL,
  `receipt_code` varchar(255) DEFAULT NULL,
  `repo_link` varchar(255) DEFAULT NULL,
  `cancelled_by` varchar(255) DEFAULT NULL,
  `cancellation_reason` text DEFAULT NULL,
  `cancellation_year` int(11) DEFAULT NULL,
  `ga_number` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `ProjectMeta`
--

INSERT INTO `ProjectMeta` (`meta_id`, `project_id`, `summary`, `attachment`, `draft_attachment`, `resources`, `receipt_code`, `repo_link`, `cancelled_by`, `cancellation_reason`, `cancellation_year`, `ga_number`) VALUES
(21, 21, 'Description 1', NULL, NULL, NULL, NULL, NULL, 'Γραμματεία', 'Κατόπιν αίτησης φοιτητή/τριας', 2025, 1234567),
(23, 23, 'Description 4 ', 'project-pdfs/pdf_68441aa8c0bc78.83120604_Ergastiriaki_Askisi_24-25-1.0.pdf', NULL, NULL, NULL, NULL, '0', 'από Διδάσκοντα', 2025, 192879),
(28, 28, 'Description 1', 'project-pdfs/pdf_68471676c0b083.79946510_Ergastiriaki_Askisi_24-25-1.0.pdf', 'project-pdfs/draft_684d41f92988f1.50350383_my-invoice__1_.pdf', NULL, NULL, 'https://eclass.upatras.gr/', NULL, NULL, NULL, NULL),
(30, 30, 'Description 7', NULL, NULL, NULL, NULL, 'https://eclass.upatras.gr/', NULL, NULL, NULL, 1234567),
(31, 31, 'Description 8', 'project-pdfs/pdf_684d80a0544775.95479318_Ergastiriaki_Askisi_24-25-1.0.pdf', 'project-pdfs/draft_684d8876ac55b1.26641284_Ergastiriaki_Askisi_24-25-1.0.pdf', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(39, 39, 'Description 10', 'project-pdfs/pdf_685461c8d167e0.13929616_Ergastiriaki_Askisi_24-25-1.0.pdf', 'project-pdfs/draft_685464eb99df59.13976742_Ergastiriaki_Askisi_24-25-1.0.pdf', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(40, 40, 'Description 12', 'project-pdfs/pdf_685672e6132be8.96922727_Ergastiriaki_Askisi_24-25-1.0.pdf', 'project-pdfs/draft_68567c14e4c3c8.26248197_Ergastiriaki_Askisi_24-25-1.0.pdf', NULL, NULL, 'https://eclass.upatras.gr/modules/document/index.php?course=CEID1091&openDir=/5c890086GeF9', '', '', NULL, NULL),
(41, 41, 'Description 15', 'project-pdfs/pdf_685674cb87ca39.38383117_Ergastiriaki_Askisi_24-25-1.0.pdf', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `ProjectNotes`
--

CREATE TABLE `ProjectNotes` (
  `note_id` int(11) NOT NULL,
  `project_ref` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `body` text NOT NULL,
  `noted_on` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `ProjectNotes`
--

INSERT INTO `ProjectNotes` (`note_id`, `project_ref`, `author_id`, `body`, `noted_on`) VALUES
(10, 30, 1, 'Συνάντηση με φοιτητή !!!', '2025-06-14 17:24:19'),
(11, 40, 1, 'Πρέπει να κανονιστεί συνάντηση με τον Φοιτητή !', '2025-06-21 12:19:00'),
(27, 40, 1, '12345', '2025-06-21 15:49:53');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `Projects`
--

CREATE TABLE `Projects` (
  `project_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `phase` enum('draft','submitted','active','in_review','exam_scheduled','marking','marked','cancelled','finished') DEFAULT 'draft',
  `supervisor_id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `reviewer_a` int(11) DEFAULT NULL,
  `reviewer_b` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT current_timestamp(),
  `modified_on` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `finished_on` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `Projects`
--

INSERT INTO `Projects` (`project_id`, `title`, `phase`, `supervisor_id`, `student_id`, `reviewer_a`, `reviewer_b`, `created_on`, `modified_on`, `finished_on`) VALUES
(21, 'Topic 5', 'cancelled', 7, 5, NULL, NULL, '2025-06-07 00:01:15', '2025-06-14 15:04:32', NULL),
(23, 'Topic 4', 'cancelled', 1, NULL, NULL, NULL, '2023-06-13 13:55:36', '2025-06-12 19:40:05', NULL),
(28, 'Topic 1', 'finished', 1, 1, 7, 10, '2025-06-09 20:14:30', '2025-06-19 19:53:45', '2025-06-19 19:53:42'),
(30, 'Topic 7', 'finished', 1, 10, 9, 10, '2025-06-08 16:40:23', '2025-06-19 19:53:08', '2025-06-14 17:50:15'),
(39, 'Topic 10', 'marking', 1, 8, 9, 10, '2025-06-19 22:15:20', '2025-06-19 22:54:55', NULL),
(40, 'Topic 12', 'in_review', 1, 9, 9, 10, '2023-06-19 11:52:54', '2025-06-21 16:00:21', '2025-06-21 13:42:51'),
(41, 'Topic 15', 'draft', 9, NULL, NULL, NULL, '2025-06-21 12:00:59', '2025-06-21 12:15:17', NULL);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `Scores`
--

CREATE TABLE `Scores` (
  `score_id` int(11) NOT NULL,
  `project_ref` int(11) NOT NULL,
  `supervisor_id` int(11) NOT NULL,
  `reviewer1_id` int(11) NOT NULL,
  `reviewer2_id` int(11) NOT NULL,
  `sup_quality` int(11) DEFAULT NULL,
  `sup_duration` int(11) DEFAULT NULL,
  `sup_text` int(11) DEFAULT NULL,
  `sup_presentation` int(11) DEFAULT NULL,
  `rev1_quality` int(11) DEFAULT NULL,
  `rev1_duration` int(11) DEFAULT NULL,
  `rev1_text` int(11) DEFAULT NULL,
  `rev1_presentation` int(11) DEFAULT NULL,
  `rev2_quality` int(11) DEFAULT NULL,
  `rev2_duration` int(11) DEFAULT NULL,
  `rev2_text` int(11) DEFAULT NULL,
  `rev2_presentation` int(11) DEFAULT NULL,
  `final_mark` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `Scores`
--

INSERT INTO `Scores` (`score_id`, `project_ref`, `supervisor_id`, `reviewer1_id`, `reviewer2_id`, `sup_quality`, `sup_duration`, `sup_text`, `sup_presentation`, `rev1_quality`, `rev1_duration`, `rev1_text`, `rev1_presentation`, `rev2_quality`, `rev2_duration`, `rev2_text`, `rev2_presentation`, `final_mark`) VALUES
(1, 28, 1, 7, 10, 9, 10, 10, 10, 10, 9, 9, 9, 9, 9, 9, 9, 9.33),
(2, 31, 1, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 30, 1, 9, 10, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9.00),
(4, 39, 1, 9, 10, 9, 9, 9, 9, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3.00),
(5, 40, 1, 9, 10, 9, 9, 9, 9, 9, 8, 8, 8, 8, 8, 8, 8, 8.42);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `Students`
--

CREATE TABLE `Students` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `student_number` varchar(20) NOT NULL,
  `street` varchar(255) DEFAULT NULL,
  `number` varchar(10) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `postcode` varchar(20) DEFAULT NULL,
  `father_name` varchar(255) DEFAULT NULL,
  `landline_telephone` varchar(20) DEFAULT NULL,
  `mobile_telephone` varchar(20) DEFAULT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `Students`
--

INSERT INTO `Students` (`id`, `username`, `password`, `name`, `surname`, `student_number`, `street`, `number`, `city`, `postcode`, `father_name`, `landline_telephone`, `mobile_telephone`, `email`) VALUES
(1, 'makis', '0000', 'Makis', 'Makopoulos', '10433999', 'test street', '45', 'test city', '39955', 'Orestis', '2610333000', '6939096979', '104333999@students.upatras.gr'),
(5, 'john', '0000', 'John', 'Lennon', '10434000', 'Ermou', '18', 'Athens', '10431', 'George', '2610123456', '6970001112', 'st10434000@upnet.gr'),
(6, 'petros', '0000', 'Petros', 'Daidalos', '10434001', 'Adrianou', '20', 'Thessaloniki', '54248', 'Giannis', '2610778899', '6970001112', 'st10434001@upnet.gr'),
(7, 'test', '0000', 'test', 'name', '10434002', 'str', '1', 'patra', '26222', 'father', '2610123456', '6912345678', 'st10434002@upnet.gr'),
(8, 'robert', '0000', 'Robert', 'Smith', '10434003', 'Fascination', '17', 'London', '1989', 'Alex', '2610251989', '6902051989', 'st10434003@upnet.gr'),
(9, 'rex', '0000', 'Rex', 'Tyrannosaurus', '10434004', 'Cretaceous', '2', 'Laramidia', '54321', 'Daspletosaurus', '2610432121', '6911231234', 'st10434004@upnet.gr'),
(10, 'paul', '0000', 'Paul', 'Mescal ', '10434005', 'Smith Str.', '33', 'New York ', '59', 'Paul', '-', '-', 'st10434005@upnet.gr'),
(11, 'pedro', '0000', 'Pedro', 'Pascal', '10434006', 'Johnson', '90', 'New York ', '70', 'José ', '-', '-', 'st10434006@upnet.gr'),
(12, 'david', '0000', 'David', 'Gilmour', '10434007', 'Sortef', '29', 'New York', '26', 'Douglas', '-', '-', 'st10434007@upnet.gr'),
(13, 'lana', '0000', 'Lana', 'Del Rey ', '10434008', 'Groove Str.', '23', 'Los Angeles', '1', 'none', '-', '-', 'st10434008@upnet.gr'),
(14, 'stevie', '0000', 'Stevie', 'Nicks', '10434009', 'Magic Str. ', '8', 'New Orleans', '35', 'Jess ', '56', '67', 'st10434009@upnet.gr'),
(15, 'margaret', '0000', 'Margaret', 'Qualley', '10434010', 'Substance Str.', '25', 'Los Angeles ', '7', 'Paul', '67', '90', 'st10434010@upnet.gr'),
(16, 'mia', '0000', 'Mia', 'Goth', '10434011', 'Pearl Str. ', '4', 'Michigan', '8', 'Lee', '-', '-', 'st10434011@upnet.gr'),
(17, 'florence', '0000', 'Florence ', 'Pugh', '10434012', 'Midsommar Str. l', '1', 'Away', '24', '-', '5', '2', 'st10434012@upnet.gr'),
(18, 'pj', '0000', 'PJ ', 'Harvey', '10434013', 'Lonely Str.', '27', 'Bridport', '-7', 'Ray', '56', '43', 'st10434013@upnet.gr'),
(19, 'penlope', '0000', 'Penélope', 'Cruz', '10434014', 'Almadovar', '55', 'Madrid', '23', 'Eduardo ', '5', '4', 'st10434014@upnet.gr'),
(20, 'emma', '0000', 'Emma', 'Stone', '10434015', 'Poor Str.', '3', 'Paris ', '34', 'none', '2333333', '4455555', 'st10434015@upnet.gr'),
(21, 'jenny', '0000', 'Jenny', 'Vanou', '10434016', 'Mpouat Str.', '23', 'Athens', '10', 'Basil', '09', '45', 'st10434016@upnet.gr'),
(22, 'salma', '0000', 'Salma ', 'Hayek', '10434017', 'Desperado Str. ', '24', 'Madrid ', '656', 'Sami', '344', '221', 'st10434017@upnet.gr'),
(23, 'julie', '0000', 'Julie ', 'Delpy', '10434018', 'Before Str.', '36', 'Paris', '567', 'Kieślowski', '1223', '3455', 'st10434018@upnet.gr'),
(24, 'giannis', '0000', 'Giannis ', 'Molotof', '10434019', 'Trypes Str.', '3', 'Athens', '2354', 'Theos', '23', '45', 'st10434019@upnet.gr'),
(25, 'eleutheria', '0000', 'Eleutheria ', 'Arvanitaki', '10434020', 'Entexno Str. ', '2', 'Athens', '345', 'Kosmos', '657', '345', 'st10434020@upnet.gr'),
(26, 'marina', '0000', 'Marina', 'Spanou', '10434021', 'Pagkrati Str.', '25', 'Athens', '2456', 'Gates', '897', '354', 'st10434021@upnet.gr'),
(27, 'rena', '0000', 'Rena', 'Koumioti', '10434022', 'Mpouat Str.', '24', 'Athens', '5749', 'Ellhniko', '23557', '32453', 'st10434022@upnet.gr'),
(28, 'charlotte', '0000', 'Charlotte', 'Aitchison', '10434023', 'Boiler Room St', '365', 'New York', '360', 'Jon', '2610365365', '693653365', 'st10434023@upnet.gr'),
(29, 'rhaenyra', '0000', 'Rhaenyra', 'Targaryen', '10434024', 'Dragon St', '2021', 'Kings Landing', '2021', 'Viserys', '2610101010', '6910101010', 'st10434024@upnet.gr'),
(30, 'ben', '0000', 'Ben', 'Dover', '10434025', 'Colon Str.', '124A', 'NY', '11045', 'Carlos', '2584694587', '5841852384', 'st10434025@upnet.gr'),
(31, 'marios', '0000', 'Marios', 'Konstantinou', '10434026', 'Korinthou', '266', 'Patras', '26223', 'Ioannis', '+302105562567', '+306975562567', 'st10434026@upnet.gr'),
(32, 'nicholas', '0000', 'Nicholas ', 'Hoult', '10434027', 'Nosferatu Str.', '34', 'London', '567', 'Roger', '436', '46478', 'st10434027@upnet.gr'),
(33, 'joohyuk', '0000', 'Joo Hyuk', 'Nam', '10434028', 'Kanakari', '135', 'Patra', '26440', 'Baek Yi Jin', '2610443568', '6978756432', 'st10434028@upnet.gr'),
(34, 'nikos', '0000', 'Nikos', 'Kosmopoulos', '10434029', 'Kolokotroni', '6', 'Athens', '34754', 'George', '2104593844', '6987655433', 'st10434029@upnet.gr'),
(36, 'maria', '0000', 'Maria', 'Db', '10434031', 'Jason ', '33', 'London', '44391', 'Tasos', '2109993719', '6923144642', 'st10434031@upnet.gr'),
(39, 'giorgos', '0000', 'GIORGOS', 'MASOURAS', '10434034', 'korinthou', '56', 'patras', '56892', 'nikos', '2610485796', '6934527125', 'st10434034@upnet.gr'),
(40, 'trakis', '0000', 'Trakis', 'Giannakopoulos', '10434035', 'Othonos kai Amalias ', '100', 'Patras', '26500', 'None', '2610381393', '6028371830', 'st10434035@upnet.gr'),
(41, 'chris', '0000', 'Chris', 'Kouvadis', '10434036', 'vanizelou', '36', 'Patras', '26500', 'Pfloutsou', '2610995999', '6947937524', 'st10434036@upnet.gr'),
(42, 'pafloutsou', '0000', 'pafloutsou', 'kaskarai', '10434037', 'kolokotroni', '12', 'Patras', '26500', 'mauragkas', '2610978423', '6935729345', 'st10434037@upnet.gr'),
(44, 'billy', '0000', 'Billy', 'Diesel', '10434038', 'Alexandras Ave', '12', 'Athens', '11521', 'Iman', '2101234567', '6912345678', 'st10434038@upnet.gr'),
(46, 'tome', '0000', 'Tome', 'of Madness', '10434039', 'Panepisthmiou', '69', 'Patras', '26441', 'Prafit', '2610654321', '6969966996', 'st10434039@upnet.gr'),
(47, 'fort', '0000', 'fort', 'nite', '10434040', 'karaiskakis', '69', 'tilted tower', '4747', 'epic games', '2610747474', '6988112233', 'st10434040@upnet.gr'),
(48, 'zeus', '0000', 'Zeus', 'Ikosaleptos', '10434041', 'Novi', '25', 'Athens', '20033', 'Kleft', '2109090901', '6900008005', 'st10434041@upnet.gr'),
(49, 'ag', '0000', 'AG', 'Cook', '10434042', 'Britpop', '7G', 'London', '2021', 'PC Music', '2121212121', '1212121212', 'st10434042@upnet.gr'),
(51, 'kostas', '0000', 'Kostas', 'Poupis', '10434044', 'Ag Kiriakis', '11', 'Papaou', '50501', 'Aelakis', '222609123', '698452154', 'st10434044@upnet.gr'),
(52, 'hugh', '0000', 'Hugh', 'Jass', '10434045', 'Wall Street', '69', 'Jerusalem', '478', 'Mike Oxlong', '69696969', '696969420', 'st10434045@upnet.gr'),
(53, 'xontro', '0000', 'Xontro ', 'Pigouinaki', '10434046', 'Krasopotirou', '69', 'Colarato', '14121', 'Adolf Heisenberg', '6913124205', '4747859625', 'st10434046@upnet.gr'),
(54, 'aria', '0000', 'Μaria', 'Nikolaou', '10434047', 'Achilleos', '21', 'Athens', '10437', 'Dimitris', '2109278907', '6945533213', 'st10434047@upnet.gr'),
(55, 'eleni', '0000', 'Eleni', 'Fotiou', '10434048', 'Adrianou ', '65', 'Athens', '10556', 'Nikos', '2108745645', '6978989000', 'st10434048@upnet.gr'),
(56, 'xara', '0000', 'Xara', 'Georgiou', '10434049', 'Chaonias ', '54', 'Athens', '10441', 'Petros', '2108724324', '6945622222', 'st10434049@upnet.gr'),
(60, 'tsili', '0000', 'Tsili', 'Doghouse', '10434053', 'novi lane', '33', 'Patras', '26478', 'Stoiximan', '2610420420', '6999999999', 'st10434053@upnet.gr'),
(61, 'marialena', '0000', 'Marialena', 'Antoniou', '10434054', 'Ermou', '24', 'Athens', '10563', 'Nikolaos', '210-5678901', '693-5678901', 'st10434054@upnet.gr'),
(62, 'ioannis', '0000', 'Ioannis', 'Panagiotou', '10434055', 'Kyprou', '42', 'Patra', '26441', 'Kwstas', '2610-123456', '698-1234567', 'st10434055@upnet.gr'),
(63, 'george', '0000', 'George', 'Karamalis', '10434056', 'Kolokotroni', '10', 'Larissa', '41222', 'Petros', '2410-456789', '697-4567890', 'st10434056@upnet.gr'),
(64, 'kyriakos', '0000', 'kyriakos', 'pareena', '10434057', 'Zakunthou', '36', 'Volos', '10654', 'Apostolos', '210-6789012', '695-6789012', 'st10434057@upnet.gr'),
(68, 'sagdy', '0000', 'Sagdy', 'Znuts', '10434061', 'Grove', '12', 'San Andreas', '123456', 'NULL', '123456789', '123456789', 'st10434061@upnet.gr'),
(69, 'mary', '0000', 'Mary', 'Poppins', '10434062', 'Niktolouloudias ', '123', 'Chalkida', '23456', 'George', '2613456089', '6980987654', 'st10434062@upnet.gr'),
(70, 'tinker', '0000', 'Tinker', 'Bell', '10434063', 'Vatomourias', '55', 'Pano Raxoula', '2345', 'Mixail', '2456034567', '6987543345', 'st10434063@upnet.gr'),
(71, 'lilly', '0000', 'Lilly', 'Bloom', '10434064', 'Patnanasis', '45', 'Patra', '26440', 'Menelaos', '2610435988', '6987555433', 'st10434064@upnet.gr'),
(73, 'kendrick', '0000', 'KENDRICK', 'NUNN', '10434066', 'OAKA', '25', 'ATHENS', '666', 'GIANNAKOPOULOS', '6982736199', '6906443321', 'st10434066@upnet.gr'),
(74, 'depeche', '0000', 'Depeche', 'Mode', '10434067', 'Enjoy The Silence', '1990', 'London', '1990', 'Dave', '1234567890', '1234567770', 'st10434067@upnet.gr'),
(75, 'name', '0000', 'name', 'surname', '10434068', 'your', '69', 'mom', '15584', 'father', '222', '2223', 'st10434068@upnet.gr'),
(77, 'aris', '0000', 'Aris', 'Poupis', '10434070', 'Mpofa', '10', 'Kolonia', '12345', 'Mpamias', '2105858858', '6935358553', 'st10434070@upnet.gr'),
(78, 'gerry', '0000', 'gerry', 'banana', '10434071', 'lootlake', '12', 'tilted', '26500', 'johnesy', '6947830287', '2610987632', 'st10434071@upnet.gr'),
(79, 'grekotsi', '0000', 'grekotsi', 'parthenios', '10434072', 'kokmotou', '69', 'thessaloniki', '20972', 'mourlo', '6947910234', '2610810763', 'st10434072@upnet.gr'),
(80, 'mochi', '0000', 'Mochi', 'Mon', '10434073', 'Novi', '55', 'Maxxwin', '99999', 'Drake', '2610550406', '6967486832', 'st10434073@upnet.gr'),
(81, 'nikolaos', '0000', 'Nikolaos', 'Serraios', '10434074', 'Papaflessa', '12', 'Patra', '26222', 'Georgios', '2610456632', '6975849305', 'st10434074@upnet.gr'),
(82, 'xaralampos', '0000', 'Xaralampos', 'Mparmaksizoglou', '10434075', 'Konstantinoupoleos', '32', 'Athens', '16524', 'Eugenios', '2109995555', '6912345678', 'st10434075@upnet.gr'),
(84, 'tortelino', '0000', 'Tortelino', 'Diagrafino', '10434077', 'emp', '69', 'empa', '5432', 'kaae', '2101312000', '6913121312', 'st10434077@upnet.gr'),
(87, 'bombardriro', '0000', 'Bombardriro', 'Crocodilo', '10434079', 'Pony Peponi', '69', 'Athens', '15344', 'Lirili Larila', '26810 12345', '6909876543', 'st10434079@upnet.gr'),
(88, 'balerinna', '0000', 'Balerinna ', 'Cappucinna', '10434080', 'mimimimi', '4', 'lalalala', '23861', 'balerinno lololo', '2610729878', '6983615882', 'st10434080@upnet.gr'),
(89, 'ntinos', '0000', 'Ntinos', 'Konstantinos', '10434081', 'Valaoritou', '1', 'patras', '26225', 'Nikolaos', '2610222222', '6988888888', 'st10434081@upnet.gr'),
(92, 'mina', '0000', 'Mina', 'Minopoulou', '10434084', 'patra', '13', 'patras', '12345', 'makis', '261044444', '699999999', 'st10434084@upnet.gr'),
(93, 'sakis', '0000', 'Sakis', 'Rouvas', '10434085', 'Raftel', '45', 'Piece', '123', 'Gol', '66666666', '66666666', 'st10434085@upnet.gr'),
(94, 'shinji', '0000', 'Shinji', 'Ikari', '10434086', '	NERV Boulevard', '	4', '	Tokyo-3', '192', 'Gendo Ikari', '	0366666666', '	08012345678', 'st10434086@upnet.gr'),
(95, 'alexis', '0000', 'Alexis', 'tsipras', '10434087', 'Kilkis', '13', 'patra', '26441', 'Kostaw', '6978215130', '6978215130', 'st10434087@upnet.gr'),
(96, 'tasos', '0000', 'Tasos', 'kolokotronhs', '10434088', 'alitheias', '69', 'Igoumenitsa', '24463', 'Theodoros', '26578953', '6978584575', 'st10434088@upnet.gr'),
(97, 'minas', '0000', 'Minas ', 'Minaroglou', '10434089', 'ksefotou', '36', 'Moon city', '245643', 'Manolis', '465352358', '698713245', 'st10434089@upnet.gr'),
(98, 'la', '0000', 'La', 'Polizia', '10434090', 'Mpatsenou', '46', 'Sideria', '164542', 'Klavdios', '4673596', '55464852', 'st10434090@upnet.gr'),
(99, 'manousos', '0000', 'manousos', 'Dlabiras', '10434091', 'giannitson', '47', 'Tripoli', '23100', 'Georgios', '23242424', '24242424', 'st10434091@upnet.gr');

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `Assessments`
--
ALTER TABLE `Assessments`
  ADD PRIMARY KEY (`assessment_id`);

--
-- Ευρετήρια για πίνακα `Professors`
--
ALTER TABLE `Professors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Ευρετήρια για πίνακα `ProjectInvites`
--
ALTER TABLE `ProjectInvites`
  ADD PRIMARY KEY (`invite_id`);

--
-- Ευρετήρια για πίνακα `ProjectLinks`
--
ALTER TABLE `ProjectLinks`
  ADD PRIMARY KEY (`id`);

--
-- Ευρετήρια για πίνακα `ProjectLogs`
--
ALTER TABLE `ProjectLogs`
  ADD PRIMARY KEY (`log_id`);

--
-- Ευρετήρια για πίνακα `ProjectMeta`
--
ALTER TABLE `ProjectMeta`
  ADD PRIMARY KEY (`meta_id`);

--
-- Ευρετήρια για πίνακα `ProjectNotes`
--
ALTER TABLE `ProjectNotes`
  ADD PRIMARY KEY (`note_id`);

--
-- Ευρετήρια για πίνακα `Projects`
--
ALTER TABLE `Projects`
  ADD PRIMARY KEY (`project_id`);

--
-- Ευρετήρια για πίνακα `Scores`
--
ALTER TABLE `Scores`
  ADD PRIMARY KEY (`score_id`);

--
-- Ευρετήρια για πίνακα `Students`
--
ALTER TABLE `Students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_number` (`student_number`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT για άχρηστους πίνακες
--

--
-- AUTO_INCREMENT για πίνακα `Assessments`
--
ALTER TABLE `Assessments`
  MODIFY `assessment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT για πίνακα `Professors`
--
ALTER TABLE `Professors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT για πίνακα `ProjectInvites`
--
ALTER TABLE `ProjectInvites`
  MODIFY `invite_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT για πίνακα `ProjectLinks`
--
ALTER TABLE `ProjectLinks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT για πίνακα `ProjectLogs`
--
ALTER TABLE `ProjectLogs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT για πίνακα `ProjectMeta`
--
ALTER TABLE `ProjectMeta`
  MODIFY `meta_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT για πίνακα `ProjectNotes`
--
ALTER TABLE `ProjectNotes`
  MODIFY `note_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT για πίνακα `Projects`
--
ALTER TABLE `Projects`
  MODIFY `project_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT για πίνακα `Scores`
--
ALTER TABLE `Scores`
  MODIFY `score_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT για πίνακα `Students`
--
ALTER TABLE `Students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
