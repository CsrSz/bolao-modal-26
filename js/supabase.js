const SUPABASE_URL =
    'https://emajypraxseliztslvuh.supabase.co';

const SUPABASE_KEY =
    'sb_publishable_Ig7eWDL-zUc5El3-QcFtTw_sWWlQ7ex';

const cliente = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// Isso garante que tanto o painel admin quanto o resto do site funcionem
window.supabase = cliente;
window.supabaseClient = cliente;