$arquivos = @(
    "01_diagnostico.sql",
    "02_funcoes_contexto.sql",
    "03_politicas.sql",
    "04_permissoes.sql",
    "05_testes.sql",
    "06_politicas_mensagens.sql",
    "07_politicas_administracao.sql",
    "08_membros_grupos.sql",
    "09_politicas_usuarios.sql"
)

Write-Host "CALLZUP - Validacao local RLS"

foreach ($nome in $arquivos) {
    $caminho = Join-Path $PSScriptRoot $nome

    if (Test-Path $caminho) {
        $tamanho = (Get-Item $caminho).Length

        if ($tamanho -eq 0) {
            Write-Host "[VAZIO] $nome"
        }
        else {
            Write-Host "[OK] $nome"
        }
    }
    else {
        Write-Host "[FALTANDO] $nome"
    }
}

Write-Host "Validacao concluida. Nenhum SQL foi executado."
