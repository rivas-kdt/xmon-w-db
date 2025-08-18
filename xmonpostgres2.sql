--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-08-18 14:25:02

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5000 (class 1262 OID 16388)
-- Name: xmon; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE xmon WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Philippines.1252';


ALTER DATABASE xmon OWNER TO postgres;

\connect xmon

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16401)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5001 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 893 (class 1247 OID 16442)
-- Name: role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.role_enum AS ENUM (
    'admin',
    'worker'
);


ALTER TYPE public.role_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 16494)
-- Name: inventory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lot_no text NOT NULL,
    quantity integer
);


ALTER TABLE public.inventory OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16485)
-- Name: parts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parts (
    lot_no text NOT NULL,
    stock_no text,
    product_code text,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.parts OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 24576)
-- Name: parts_location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parts_location (
    lot_no text NOT NULL,
    warehouse_id uuid NOT NULL
);


ALTER TABLE public.parts_location OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 24593)
-- Name: recipients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipients (
    id uuid NOT NULL,
    email text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    isactive boolean NOT NULL
);


ALTER TABLE public.recipients OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16476)
-- Name: transaction_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lot_no character varying(50) NOT NULL,
    status text,
    quantity integer,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.transaction_history OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16389)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(100) NOT NULL,
    role public.role_enum NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16451)
-- Name: warehouse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warehouse (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    location character varying(100) NOT NULL,
    warehouse character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.warehouse OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16458)
-- Name: worker_location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.worker_location (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    warehouse_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.worker_location OWNER TO postgres;

--
-- TOC entry 4992 (class 0 OID 16494)
-- Dependencies: 223
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.inventory VALUES ('30672116-c79b-4cee-b123-a2da6bddb807', '01578560005430', 325);
INSERT INTO public.inventory VALUES ('cebc8867-0c17-442c-a78a-3e5cbb6d5af2', '01578560008100', 200);
INSERT INTO public.inventory VALUES ('46806e98-0d21-4162-ad15-577998c19b69', '01578560030700', 150);
INSERT INTO public.inventory VALUES ('eca37035-5ff7-4e48-b753-2ae97d9c0f73', '01578560051625
 ', 4000);
INSERT INTO public.inventory VALUES ('11955cdd-f638-488f-9e82-cba6ccf25bb7', '01578560061245', 1000);
INSERT INTO public.inventory VALUES ('7ef546e0-5bc6-4093-b74d-3404dc6c76bf', '01578560099999', 400);
INSERT INTO public.inventory VALUES ('c9dfd1ad-dd2d-403d-9fe5-d7a199c951a6', '01578560150525', 200);
INSERT INTO public.inventory VALUES ('c39f3fbb-4b93-418b-b9d5-f0c4537200a3', '01578560150526', 500);
INSERT INTO public.inventory VALUES ('3cc3f4c0-59ae-484c-a147-fd116fa7ee91', '01578560190525
 ', 1000);
INSERT INTO public.inventory VALUES ('fbf29f00-ab81-489d-9e85-13eb8cb93ab9', '01578560200525', 450);
INSERT INTO public.inventory VALUES ('0b657886-779e-47a1-aa58-ce003ca7e95f', '01578560210525', 1000);
INSERT INTO public.inventory VALUES ('36d09134-85ad-4714-a9e0-c9ed27224e65', '01578560220525', 750);
INSERT INTO public.inventory VALUES ('973c43c2-cae7-4d3e-899b-0abf499bcfdb', '01578562210525', 200);
INSERT INTO public.inventory VALUES ('ace64802-2877-4d67-b183-dd89ccaef3df', '01578562220525', 350);
INSERT INTO public.inventory VALUES ('2c908376-88ec-4a38-afe1-a2cc75bfdb50', '01603433000001', 25);
INSERT INTO public.inventory VALUES ('249ee580-7012-45aa-9a52-ed318732a268', '01707386000001', 0);
INSERT INTO public.inventory VALUES ('d801e082-9a10-4ee1-a1cb-c9d36637ed9b', '01717899', 1);
INSERT INTO public.inventory VALUES ('97b36668-ba5f-4a4e-b79e-a190f6701559', '01719928000101', 18);
INSERT INTO public.inventory VALUES ('95c7c8e0-e8f2-41cf-aacd-7e706d8b2a99', '01730199010101', 2);
INSERT INTO public.inventory VALUES ('16bfbb51-48a0-43ef-940c-f4ca3f97b761', '01730200000001', 0);
INSERT INTO public.inventory VALUES ('e10874db-a65a-4b7c-8e92-f2c0ea711a32', '01730203000001', 1);
INSERT INTO public.inventory VALUES ('cb682726-c6d3-428e-9d37-5ec4858195da', '01738345000001', 9);
INSERT INTO public.inventory VALUES ('57bf26f8-b838-4aeb-9a69-9b3467428cb0', '317MW97', 1);


--
-- TOC entry 4991 (class 0 OID 16485)
-- Dependencies: 222
-- Data for Name: parts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.parts VALUES ('01578560005430', '31379-05430', 'CS', 'Circular Saw RCS', '2025-05-16 07:38:15.303124+08', '2025-05-16 07:38:15.303124+08');
INSERT INTO public.parts VALUES ('01578560008100', '31379-08500', 'DB', 'Drill Bit x500', '2025-05-16 07:42:02.44624+08', '2025-05-16 07:42:02.44624+08');
INSERT INTO public.parts VALUES ('01578560030700', '31379-00049', 'ED', 'Electric Driller x7000', '2025-05-16 07:33:47.578107+08', '2025-05-16 07:33:47.578107+08');
INSERT INTO public.parts VALUES ('01578560051625
 ', '31379-51625', 'SD', 'Screwdriver ドライバー', '2025-05-16 10:13:03.301671+08', '2025-05-16 10:13:03.301671+08');
INSERT INTO public.parts VALUES ('01578560061245', '31379-61245', 'XW', 'Cross Screw', '2025-05-16 07:59:07.617973+08', '2025-05-16 07:59:07.617973+08');
INSERT INTO public.parts VALUES ('01578560099999', '31379-99999', 'HN', 'Hex Nut', '2025-05-16 07:42:01.104749+08', '2025-05-16 07:42:01.104749+08');
INSERT INTO public.parts VALUES ('01578560150525', '31379-51525', 'DB', 'Drill Bit ドリルビット', '2025-05-30 08:05:21.629348+08', '2025-05-30 08:05:21.629348+08');
INSERT INTO public.parts VALUES ('01578560150526', '31379-51525', 'DB', 'Drill Bit', '2025-05-30 08:05:23.459129+08', '2025-05-30 08:05:23.459129+08');
INSERT INTO public.parts VALUES ('01578560190525
 ', '31379-51925', 'DB', 'Axle Tool', '2025-05-19 15:04:45.307017+08', '2025-05-19 15:04:45.307017+08');
INSERT INTO public.parts VALUES ('01578560200525', '31379-52025', 'DB', 'Drill Bit', '2025-05-20 06:42:27.106886+08', '2025-05-20 06:42:27.106886+08');
INSERT INTO public.parts VALUES ('01578560210525', '31379-52125', 'PS', 'Power Saw ', '2025-05-21 12:46:14.372892+08', '2025-05-21 12:46:14.372892+08');
INSERT INTO public.parts VALUES ('01578560220525', '31379-52225', 'SD', 'Screw Driver', '2025-05-22 07:45:17.304929+08', '2025-05-22 07:45:17.304929+08');
INSERT INTO public.parts VALUES ('01578562210525', '31379-52125', 'PS', 'Power Saw ', '2025-05-21 13:44:02.276373+08', '2025-05-21 13:44:02.276373+08');
INSERT INTO public.parts VALUES ('01578562220525', '31379-52225', 'SD', 'Screw Driver', '2025-05-22 15:43:22.454554+08', '2025-05-22 15:43:22.454554+08');
INSERT INTO public.parts VALUES ('01603433000001', '81002-405B_NB', 'DG', '【12V/18V/18T】【新型】注文仕様書、シリンダーコントローララック', '2025-06-18 10:44:23.991072+08', '2025-06-18 10:44:23.991072+08');
INSERT INTO public.parts VALUES ('01707386000001', '31565-00871_R01_NB', 'DG', '【18T】ピストン', '2025-06-18 10:50:28.657922+08', '2025-06-18 10:50:28.657922+08');
INSERT INTO public.parts VALUES ('01717899', '11062-00439', 'DG', '【18V/18T】クランク軸組立', '2025-06-02 17:15:05.898532+08', '2025-06-02 17:15:05.898532+08');
INSERT INTO public.parts VALUES ('01719928000101', '31281-00537_R08_NB', 'DG', '【12V/18V/18T】シリンダライナ、　', '2025-06-30 12:35:53.861935+08', '2025-06-30 12:35:53.861935+08');
INSERT INTO public.parts VALUES ('01730199010101', '31095-06772_NB', 'DG', '【18T】カバー、ケーシング蓋', '2025-06-18 10:45:45.80659+08', '2025-06-18 10:45:45.80659+08');
INSERT INTO public.parts VALUES ('01730200000001', '31104-32042', 'DG', '【18T】管、高圧過給機空気入口管', '2025-06-09 13:48:31.148714+08', '2025-06-09 13:48:31.148714+08');
INSERT INTO public.parts VALUES ('01730203000001', '81002-41923_R00_NB', 'DG', '【18V/18T】注文仕様書、潤滑油主こし器', '2025-06-30 13:12:23.079238+08', '2025-06-30 13:12:23.079238+08');
INSERT INTO public.parts VALUES ('01738345000001', '31165-00049', 'DG', '【12V/18V/18T】給気管', '2025-06-09 13:24:48.080324+08', '2025-06-09 13:24:48.080324+08');
INSERT INTO public.parts VALUES ('317MW97', '81002-26206', 'DG', '【18T(50Hz)】注文仕様書、過給機（ＴＣＸ２３）', '2025-06-02 17:23:28.560821+08', '2025-06-02 17:23:28.560821+08');


--
-- TOC entry 4993 (class 0 OID 24576)
-- Dependencies: 224
-- Data for Name: parts_location; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.parts_location VALUES ('01578560005430', '6939e940-7c6f-48b3-8393-964623175c24');
INSERT INTO public.parts_location VALUES ('01578560008100', '4ac922c7-67ae-48b6-8a41-e582253ce4f9');
INSERT INTO public.parts_location VALUES ('01578560030700', '6939e940-7c6f-48b3-8393-964623175c24');
INSERT INTO public.parts_location VALUES ('01578560051625
 ', '6939e940-7c6f-48b3-8393-964623175c24');
INSERT INTO public.parts_location VALUES ('01578560061245', 'e3d2eaf4-5a6d-4dd6-8a33-f182a097b1d2');
INSERT INTO public.parts_location VALUES ('01578560099999', '4ac922c7-67ae-48b6-8a41-e582253ce4f9');
INSERT INTO public.parts_location VALUES ('01578560150525', '6939e940-7c6f-48b3-8393-964623175c24');
INSERT INTO public.parts_location VALUES ('01578560150526', '6939e940-7c6f-48b3-8393-964623175c24');
INSERT INTO public.parts_location VALUES ('01578560190525
 ', '4ac922c7-67ae-48b6-8a41-e582253ce4f9');
INSERT INTO public.parts_location VALUES ('01578560200525', '4ac922c7-67ae-48b6-8a41-e582253ce4f9');
INSERT INTO public.parts_location VALUES ('01578560210525', '6939e940-7c6f-48b3-8393-964623175c24');
INSERT INTO public.parts_location VALUES ('01578560220525', '4ac922c7-67ae-48b6-8a41-e582253ce4f9');
INSERT INTO public.parts_location VALUES ('01578562210525', '4ac922c7-67ae-48b6-8a41-e582253ce4f9');
INSERT INTO public.parts_location VALUES ('01578562220525', '4ac922c7-67ae-48b6-8a41-e582253ce4f9');
INSERT INTO public.parts_location VALUES ('01603433000001', '6939e940-7c6f-48b3-8393-964623175c24');
INSERT INTO public.parts_location VALUES ('01707386000001', 'e3d2eaf4-5a6d-4dd6-8a33-f182a097b1d2');
INSERT INTO public.parts_location VALUES ('01717899', '4ac922c7-67ae-48b6-8a41-e582253ce4f9');
INSERT INTO public.parts_location VALUES ('01719928000101', '4ac922c7-67ae-48b6-8a41-e582253ce4f9');
INSERT INTO public.parts_location VALUES ('01730199010101', '6939e940-7c6f-48b3-8393-964623175c24');
INSERT INTO public.parts_location VALUES ('01730200000001', 'e3d2eaf4-5a6d-4dd6-8a33-f182a097b1d2');
INSERT INTO public.parts_location VALUES ('01730203000001', '4ac922c7-67ae-48b6-8a41-e582253ce4f9');
INSERT INTO public.parts_location VALUES ('01738345000001', '6939e940-7c6f-48b3-8393-964623175c24');
INSERT INTO public.parts_location VALUES ('317MW97', 'a2f3f8bf-f428-410f-a12b-8304affd7dcf');


--
-- TOC entry 4994 (class 0 OID 24593)
-- Dependencies: 225
-- Data for Name: recipients; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.recipients VALUES ('265eb2fc-d657-4155-b15b-211a68c795ab', 'rivasedricjay@gmail.com', '2025-05-19 13:53:02.764882+08', true);
INSERT INTO public.recipients VALUES ('5a901101-9f1a-4891-a483-3e4a131d78b4', 'tagumpayfund@gmail.com', '2025-03-17 09:27:06.632884+08', false);
INSERT INTO public.recipients VALUES ('7615c3dd-2a69-4627-a7b0-d3637777bf5a', 'rivas-kdt@global.kawasaki.com', '2025-04-22 13:05:46.634547+08', false);
INSERT INTO public.recipients VALUES ('bd6b288d-29e3-45af-bdc8-e7bfa0207211', 'kikuchi_s@global.kawasaki.com', '2025-06-30 15:10:49.568026+08', true);
INSERT INTO public.recipients VALUES ('e15ec8e7-2350-4b93-bdce-095585b4f471', 'joshuatanedo7@gmail.com', '2025-05-27 11:42:51+08', true);


--
-- TOC entry 4990 (class 0 OID 16476)
-- Dependencies: 221
-- Data for Name: transaction_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.transaction_history VALUES ('0c269881-64c5-4859-a457-aeb64fc35d7b', '317MW97', 'stocked', 1, '2025-06-02 17:23:30.754517+08');
INSERT INTO public.transaction_history VALUES ('107aba34-5f32-42a9-9356-94f7f23d0366', '01578560190525
 ', 'stocked', 500, '2025-05-19 15:31:56.362242+08');
INSERT INTO public.transaction_history VALUES ('13ec99ef-64c4-4d1c-9557-218620a646bc', '01578560200525', 'stocked', 500, '2025-05-20 06:42:28.61621+08');
INSERT INTO public.transaction_history VALUES ('152b296c-2e1e-4c8b-837a-1378b4a7c41e', '01578560051625
 ', 'shipped', 900, '2025-05-27 10:14:18+08');
INSERT INTO public.transaction_history VALUES ('2e82a22f-7089-4f94-91d2-d60e280daba9', '01578560030700', 'shipped', 100, '2025-05-20 12:27:31.021717+08');
INSERT INTO public.transaction_history VALUES ('30a9fde0-16ed-4106-b384-987b8007fddb', '01717899', 'stocked', 1, '2025-06-02 17:15:09.170547+08');
INSERT INTO public.transaction_history VALUES ('322d99d8-8434-4f39-90f7-bd7372292a2b', '01578560008100', 'stocked', 250, '2025-05-16 07:42:03.07881+08');
INSERT INTO public.transaction_history VALUES ('37704b67-5758-47ce-b11a-baa2ae22c12c', '01578560008100', 'shipped', 50, '2025-05-16 07:47:45.021676+08');
INSERT INTO public.transaction_history VALUES ('3dab01f1-8c70-4fbd-abf2-4d0a3dee2037', '01578560099999', 'stocked', 500, '2025-05-16 07:42:01.75179+08');
INSERT INTO public.transaction_history VALUES ('401ae72c-b285-4430-b1ea-b26682a4a77f', '01578560030700', 'stocked', 250, '2025-04-16 07:33:48.235356+08');
INSERT INTO public.transaction_history VALUES ('4649a816-c70d-4712-a9ad-51baadd37773', '01730200000001', 'stocked', 1, '2025-06-09 13:48:34.294141+08');
INSERT INTO public.transaction_history VALUES ('47b39b08-f710-4abb-9978-ab894a0d41cc', '01578560051625
 ', 'shipped', 32, '2025-05-21 12:42:33.375113+08');
INSERT INTO public.transaction_history VALUES ('5061a2df-94f3-4625-8d50-4f9dfbda5403', '01578560190525
 ', 'stocked', 500, '2025-05-19 15:04:46.003838+08');
INSERT INTO public.transaction_history VALUES ('5742171a-e03b-44db-ace6-b9400f93d68f', '01578560150526', 'stocked', 500, '2025-05-30 08:05:24.264241+08');
INSERT INTO public.transaction_history VALUES ('5cc44eef-8c45-4e0e-8d0b-1a2739d829a0', '01578560220525', 'shipped', 250, '2025-05-22 08:11:31.731+08');
INSERT INTO public.transaction_history VALUES ('5d9de10f-ff89-40b4-9407-c8ef7307bd89', '01578562210525', 'shipped', 50, '2025-05-22 07:29:37.520563+08');
INSERT INTO public.transaction_history VALUES ('6a24bf09-dad1-448e-9d06-308bc3eb9ef0', '01578560210525', 'stocked', 500, '2025-05-21 13:17:41.802043+08');
INSERT INTO public.transaction_history VALUES ('71a92c87-b7a2-4ac0-828a-fd9dc1d4dbf6', '01707386000001', 'shipped', 9, '2025-06-30 13:59:33.280118+08');
INSERT INTO public.transaction_history VALUES ('722acd84-ae86-4a81-a61c-6cc0317eefa6', '01738345000001', 'stocked', 9, '2025-06-09 13:24:49.696762+08');
INSERT INTO public.transaction_history VALUES ('73ff0f50-a70d-4684-8926-4b1eb6f1c193', '01578560051625
 ', 'shipped', 50, '2025-05-20 10:50:16.747157+08');
INSERT INTO public.transaction_history VALUES ('78cb36e6-2224-4655-b662-e6658039c5e8', '01707386000001', 'stocked', 18, '2025-06-18 10:50:31.784053+08');
INSERT INTO public.transaction_history VALUES ('8b4ab1fa-d3c4-4283-9e0e-60ad2365ea32', '01578560099999', 'shipped', 100, '2025-05-16 07:47:44.126177+08');
INSERT INTO public.transaction_history VALUES ('8e16881f-a2ae-49ef-a50a-2e203e1c7a7d', '01578560051625
 ', 'stocked', 10000, '2025-05-16 10:13:05.83169+08');
INSERT INTO public.transaction_history VALUES ('9643f208-c683-4d05-b16d-315dca4964a2', '01578560005430', 'stocked', 325, '2025-05-16 07:38:15.95254+08');
INSERT INTO public.transaction_history VALUES ('989fa080-b3f9-47ee-aef4-0311784030b4', '01730199010101', 'stocked', 2, '2025-06-18 10:45:48.966306+08');
INSERT INTO public.transaction_history VALUES ('9ec3256e-22d6-4307-82b9-4af868d570d0', '01578560061245', 'stocked', 1000, '2025-05-19 10:37:08+08');
INSERT INTO public.transaction_history VALUES ('a2282ec7-00e6-4e73-b2ee-0ccf77313141', '01578560200525', 'stocked', 100, '2025-05-20 12:23:48.67523+08');
INSERT INTO public.transaction_history VALUES ('ac96fc9a-db9c-4cdd-8357-f8178e1ece02', '01578562220525', 'shipped', 150, '2025-05-22 15:44:40.173877+08');
INSERT INTO public.transaction_history VALUES ('ae59da9c-1d1d-4583-ba4f-495efc931735', '01578560051625
 ', 'shipped', 5000, '2025-05-18 10:14:43+08');
INSERT INTO public.transaction_history VALUES ('b02d9037-b85a-49e6-8a38-11ee09d23f88', '01578560150525', 'stocked', 200, '2025-05-30 08:05:22.414827+08');
INSERT INTO public.transaction_history VALUES ('b4fa5432-620a-4c09-a3a7-ec56bd6c6136', '01578560051625
 ', 'shipped', 18, '2025-05-21 12:42:52.567729+08');
INSERT INTO public.transaction_history VALUES ('bc5bc238-6cf4-47f6-82b9-3a224830b7d6', '01578562210525', 'shipped', 250, '2025-05-21 13:45:28.038124+08');
INSERT INTO public.transaction_history VALUES ('bec976ba-7cb1-4d83-86e1-7121e25874b0', '01707386000001', 'shipped', 9, '2025-06-30 14:00:09.027159+08');
INSERT INTO public.transaction_history VALUES ('c821ff65-7574-41c7-b847-361331857305', '01578560200525', 'stocked', 100, '2025-05-20 12:26:46.178265+08');
INSERT INTO public.transaction_history VALUES ('d6d14a78-d262-40b3-8943-1079564c2817', '01603433000001', 'stocked', 25, '2025-06-18 10:44:27.167565+08');
INSERT INTO public.transaction_history VALUES ('d7eedac2-7812-4427-af33-d37844efa2eb', '01578562220525', 'stocked', 500, '2025-05-22 15:43:23.186699+08');
INSERT INTO public.transaction_history VALUES ('d83469bf-db91-4583-bcab-9657d4ce9ccd', '01730203000001', 'stocked', 1, '2025-06-30 13:12:26.31211+08');
INSERT INTO public.transaction_history VALUES ('da6bd8fb-369c-480d-920d-a53ef488b68c', '01578560210525', 'stocked', 500, '2025-05-21 12:46:15.898354+08');
INSERT INTO public.transaction_history VALUES ('dc046d82-b591-4bcc-b73d-66ebdfe875da', '01578560200525', 'shipped', 250, '2025-05-20 06:46:41.915289+08');
INSERT INTO public.transaction_history VALUES ('de2ddeda-bf82-4ca2-a692-599c7da62037', '01730200000001', 'shipped', 1, '2025-06-09 13:49:15.71419+08');
INSERT INTO public.transaction_history VALUES ('e4013bdb-29b5-4fc8-8127-f3b606ca8881', '01578560220525', 'stocked', 1000, '2025-05-22 07:45:18.028844+08');
INSERT INTO public.transaction_history VALUES ('e4ebba92-a16f-4b36-b1cd-4e3ba6d3fce7', '01578562210525', 'stocked', 500, '2025-05-21 13:44:05.290045+08');
INSERT INTO public.transaction_history VALUES ('ed66c98e-f697-4fd7-89bf-7042ed8ac3a8', '01719928000101', 'stocked', 18, '2025-06-30 12:35:57.086933+08');


--
-- TOC entry 4987 (class 0 OID 16389)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES ('9de42763-5d3b-43ca-9a52-32b4ac0a24ad', 'username1', 'username1@gmail.com', 'testtest', 'worker', '2025-08-06 09:26:37.808523+08', '2025-08-06 09:26:37.808523+08');
INSERT INTO public.users VALUES ('254e02f4-92b5-40d9-83da-6c53fd1c84db', 'test', 'test@gmail.com', '$2b$10$tveajRWZgR9kbh0vl432TuAPvYidwDuGM5A6/ZA3R.kD4lNLmhU2C', 'worker', '2025-08-06 10:50:18.128797+08', '2025-08-06 10:50:18.128797+08');
INSERT INTO public.users VALUES ('e05fec1c-ff70-4e4e-9f58-b003baee9e4c', 'admin', 'admin@gmail.com', '$2b$10$hwSSOsyUYnX6eyWgx2Y2oegQ5fRfShEYiZ90J2KmOPytRiD3Fc0sm', 'admin', '2025-08-06 11:00:40.487424+08', '2025-08-06 11:00:40.487424+08');
INSERT INTO public.users VALUES ('42538aef-431c-4dc8-8404-ffd092cafdd6', 'worker', 'worker@yahoo.com', '$2b$10$hwSSOsyUYnX6eyWgx2Y2oegQ5fRfShEYiZ90J2KmOPytRiD3Fc0sm', 'worker', '2025-08-07 12:20:16.465419+08', '2025-08-07 12:20:16.465419+08');
INSERT INTO public.users VALUES ('6e56d155-e1fe-452f-baa2-b47adca1f7f4', 'admin2', 'admin2@gmail.com', '$2b$10$PDSMNIhw/vLaVSoiWQx67OBN1xS2ik2DATX5PalfqtmQliGQcGGKO', 'admin', '2025-03-19 09:12:32.906612+08', '2025-03-19 09:12:32.906612+08');
INSERT INTO public.users VALUES ('7e6c787f-79ee-431a-977b-c7fa43528787', 'admin', 'tagumpayfund@gmail.com', '$2a$06$XgRadj2cGEMNi8sfePAu/.Q3424IGoFpos2x0u0JTj9XK5BGI9.oS', 'admin', '2025-03-17 09:27:06.632884+08', '2025-03-17 09:27:06.632884+08');
INSERT INTO public.users VALUES ('a0312fd7-42ce-4ec8-a33b-8cc17202ee09', 'maya', 'maya@gmail.com', '$2b$10$W3s3yg6Rfvb3dWUZ.TuTpuNrUc4H56dJvSSo2e9gQqf47ztg0PygW', 'worker', '2025-06-30 14:03:59.661144+08', '2025-06-30 14:03:59.661144+08');
INSERT INTO public.users VALUES ('ab36136d-e524-4a0d-a481-14d7b8093518', 'test', 'tanedo-kdt@global.kawasaki.com', '$2b$10$phapYVaQ4lOi1UgLZlnPduZ6Er2wlxG2iwy/cJgg0GbwMlQm24VbO', 'admin', '2025-05-27 12:13:26.009824+08', '2025-05-27 12:13:26.009824+08');
INSERT INTO public.users VALUES ('ae738be0-20a4-4d40-8294-c1ac7fa3268a', 'user3', 'user3@example.com', '$2b$10$DLTcvYjLO/d.DWlK3uAmCeFk6hma39PGrVsYkjO1BUb25kA8Wq3o.', 'worker', '2025-03-19 09:12:32.906612+08', '2025-03-19 09:12:32.906612+08');


--
-- TOC entry 4988 (class 0 OID 16451)
-- Dependencies: 219
-- Data for Name: warehouse; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.warehouse VALUES ('a3492ac7-2c0a-402a-aa11-e2290fd7fae2', 'Tokyo, Japan', 'Tokyo Warehouse', '2025-08-07 12:21:09.587934+08');
INSERT INTO public.warehouse VALUES ('4ac922c7-67ae-48b6-8a41-e582253ce4f9', 'Japan', 'Japan Warehouse', '2025-03-19 09:20:36.165633+08');
INSERT INTO public.warehouse VALUES ('6939e940-7c6f-48b3-8393-964623175c24', 'Philippines', 'Philippines Warehouse', '2025-03-19 09:20:36.165633+08');
INSERT INTO public.warehouse VALUES ('a2f3f8bf-f428-410f-a12b-8304affd7dcf', 'Philippines', 'Manila Warehouse', '2025-05-16 13:06:54.004057+08');
INSERT INTO public.warehouse VALUES ('e3d2eaf4-5a6d-4dd6-8a33-f182a097b1d2', 'Japan', 'Tokyo Warehouse', '2025-05-16 07:56:11.801981+08');


--
-- TOC entry 4989 (class 0 OID 16458)
-- Dependencies: 220
-- Data for Name: worker_location; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.worker_location VALUES ('8055e68e-8eeb-4788-aeed-20c9f1037eac', '42538aef-431c-4dc8-8404-ffd092cafdd6', '6939e940-7c6f-48b3-8393-964623175c24', '2025-03-19 09:43:40.330502+08', '2025-03-19 09:43:40.330502+08');
INSERT INTO public.worker_location VALUES ('9f577ff6-5192-4a7d-b9e9-8527c93cab58', '42538aef-431c-4dc8-8404-ffd092cafdd6', '4ac922c7-67ae-48b6-8a41-e582253ce4f9', '2025-03-19 09:43:40.330502+08', '2025-03-19 09:43:40.330502+08');
INSERT INTO public.worker_location VALUES ('74ad216c-5d0b-45f3-99c5-cecadf033d35', '42538aef-431c-4dc8-8404-ffd092cafdd6', '6939e940-7c6f-48b3-8393-964623175c24', '2025-08-07 12:22:11.951958+08', '2025-08-07 12:22:11.951958+08');


--
-- TOC entry 4833 (class 2606 OID 16501)
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (lot_no);


--
-- TOC entry 4835 (class 2606 OID 24582)
-- Name: parts_location parts_location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parts_location
    ADD CONSTRAINT parts_location_pkey PRIMARY KEY (lot_no, warehouse_id);


--
-- TOC entry 4831 (class 2606 OID 16493)
-- Name: parts parts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parts
    ADD CONSTRAINT parts_pkey PRIMARY KEY (lot_no);


--
-- TOC entry 4837 (class 2606 OID 24599)
-- Name: recipients recipients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipients
    ADD CONSTRAINT recipients_pkey PRIMARY KEY (id);


--
-- TOC entry 4829 (class 2606 OID 16484)
-- Name: transaction_history transaction_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_history
    ADD CONSTRAINT transaction_history_pkey PRIMARY KEY (id);


--
-- TOC entry 4823 (class 2606 OID 16393)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4825 (class 2606 OID 16457)
-- Name: warehouse warehouse_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse
    ADD CONSTRAINT warehouse_pkey PRIMARY KEY (id);


--
-- TOC entry 4827 (class 2606 OID 16465)
-- Name: worker_location worker_location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.worker_location
    ADD CONSTRAINT worker_location_pkey PRIMARY KEY (id, user_id, warehouse_id);


--
-- TOC entry 4840 (class 2606 OID 24583)
-- Name: parts_location lot_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parts_location
    ADD CONSTRAINT lot_no_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouse(id);


--
-- TOC entry 4838 (class 2606 OID 16466)
-- Name: worker_location uid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.worker_location
    ADD CONSTRAINT uid_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4841 (class 2606 OID 24588)
-- Name: parts_location warehouse_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parts_location
    ADD CONSTRAINT warehouse_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouse(id);


--
-- TOC entry 4839 (class 2606 OID 16471)
-- Name: worker_location wid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.worker_location
    ADD CONSTRAINT wid_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouse(id);


-- Completed on 2025-08-18 14:25:02

--
-- PostgreSQL database dump complete
--

