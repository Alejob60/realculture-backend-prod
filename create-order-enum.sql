-- ================================================
-- Script para crear/actualizar enum de estados de orden
-- Fecha: 2024-12-04
-- ================================================

-- PASO 1: Verificar si el enum existe
DO $$
BEGIN
    -- Si el tipo enum NO existe, crearlo desde cero
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_entity_status_enum') THEN
        CREATE TYPE order_entity_status_enum AS ENUM (
            'pending',
            'pending_payment',
            'paid',
            'confirmed',
            'processing',
            'shipped',
            'delivered',
            'cancelled',
            'refunded'
        );
        RAISE NOTICE 'Enum order_entity_status_enum creado exitosamente con todos los estados';
    ELSE
        RAISE NOTICE 'Enum order_entity_status_enum ya existe';
        
        -- Si existe, agregar valores faltantes
        IF NOT EXISTS (
            SELECT 1 FROM pg_enum e
            JOIN pg_type t ON e.enumtypid = t.oid
            WHERE t.typname = 'order_entity_status_enum'
            AND e.enumlabel = 'pending_payment'
        ) THEN
            ALTER TYPE order_entity_status_enum ADD VALUE 'pending_payment';
            RAISE NOTICE 'Agregado: pending_payment';
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_enum e
            JOIN pg_type t ON e.enumtypid = t.oid
            WHERE t.typname = 'order_entity_status_enum'
            AND e.enumlabel = 'paid'
        ) THEN
            ALTER TYPE order_entity_status_enum ADD VALUE 'paid';
            RAISE NOTICE 'Agregado: paid';
        END IF;
    END IF;
END $$;

-- PASO 2: Verificar la columna status en la tabla orders
DO $$
BEGIN
    -- Si la tabla orders existe pero la columna status no tiene el tipo correcto
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') THEN
        -- Verificar si la columna status existe
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'orders' AND column_name = 'status'
        ) THEN
            -- Si la columna existe pero no es del tipo enum correcto, necesitamos recrearla
            -- IMPORTANTE: Esto requiere que no haya datos o migración manual
            RAISE NOTICE 'Columna status ya existe en tabla orders';
        ELSE
            -- Agregar columna status si no existe
            ALTER TABLE orders 
            ADD COLUMN status order_entity_status_enum DEFAULT 'pending';
            RAISE NOTICE 'Columna status agregada a tabla orders';
        END IF;
    ELSE
        RAISE NOTICE 'Tabla orders no existe aún - será creada por TypeORM';
    END IF;
END $$;

-- PASO 3: Mostrar todos los valores del enum
SELECT 
    n.nspname AS schema,
    t.typname AS enum_type,
    e.enumlabel AS enum_value,
    e.enumsortorder AS sort_order
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE t.typname = 'order_entity_status_enum'
ORDER BY e.enumsortorder;

-- PASO 4: Verificar estructura de tabla orders
SELECT 
    column_name,
    data_type,
    udt_name,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- ================================================
-- RESULTADO ESPERADO:
-- ================================================
-- enum_value        | sort_order
-- ------------------+------------
-- pending           | 1
-- pending_payment   | 2  ← NUEVO
-- paid              | 3  ← NUEVO
-- confirmed         | 4
-- processing        | 5
-- shipped           | 6
-- delivered         | 7
-- cancelled         | 8
-- refunded          | 9
