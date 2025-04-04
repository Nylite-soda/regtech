-- Create a function to execute SQL statements
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION exec_sql TO authenticated;

-- Revoke execute permission from anon users
REVOKE EXECUTE ON FUNCTION exec_sql FROM anon; 