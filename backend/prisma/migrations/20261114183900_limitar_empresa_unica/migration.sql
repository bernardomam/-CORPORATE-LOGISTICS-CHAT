-- Impedir que exista mais de uma empresa cadastrada
CREATE UNIQUE INDEX "Company_singleton_key"
ON "Company" ((TRUE));