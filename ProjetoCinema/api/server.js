const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// Configurações para permitir que o Front-end acesse este servidor
app.use(cors());
app.use(bodyParser.json());

// --- BANCO DE DADOS (Simulado na Memória) ---
// Aqui definimos as "tabelas" do nosso sistema de Cinema
const db = {
    filmes: [
        { id: 1, titulo: "Interestelar", diretor: "Christopher Nolan", ano: 2014, nota: 9.5 },
        { id: 2, titulo: "O Poderoso Chefão", diretor: "Coppola", ano: 1972, nota: 10 }
    ],
    series: [
        { id: 1, titulo: "Breaking Bad", temporadas: 5, plataforma: "Netflix" },
        { id: 2, titulo: "The Boys", temporadas: 4, plataforma: "Prime Video" }
    ],
    atores: [
        { id: 1, nome: "Leonardo DiCaprio", idade: 48, nacionalidade: "EUA" }
    ],
    reviews: [] // Começa vazio
};

// Função auxiliar para criar IDs novos automaticamente (1, 2, 3...)
const getNextId = (recurso) => {
    const lista = db[recurso];
    if (lista.length === 0) return 1;
    return Math.max(...lista.map(item => item.id)) + 1;
};

// Middleware: Verifica se o recurso (ex: 'filmes') existe antes de tentar acessar
app.use('/:recurso', (req, res, next) => {
    const { recurso } = req.params;
    if (!db[recurso]) {
        return res.status(404).json({ erro: "Categoria não encontrada (Tente: filmes, series, atores)" });
    }
    next();
});

// --- ROTAS DA API (CRUD) ---

// 1. LISTAR (GET) - Retorna todos os itens da categoria
app.get('/:recurso', (req, res) => {
    const { recurso } = req.params;
    res.json(db[recurso]);
});

// 2. BUSCAR UM (GET ID) - Retorna apenas um item pelo ID
app.get('/:recurso/:id', (req, res) => {
    const { recurso, id } = req.params;
    const item = db[recurso].find(i => i.id == id);
    if (!item) return res.status(404).json({ erro: "Item não encontrado" });
    res.json(item);
});

// 3. CRIAR (POST) - Adiciona um novo item
app.post('/:recurso', (req, res) => {
    const { recurso } = req.params;
    const novoItem = { id: getNextId(recurso), ...req.body };
    db[recurso].push(novoItem);
    res.status(201).json(novoItem);
});

// 4. ATUALIZAR (PUT) - Modifica um item existente
app.put('/:recurso/:id', (req, res) => {
    const { recurso, id } = req.params;
    const index = db[recurso].findIndex(i => i.id == id);

    if (index === -1) return res.status(404).json({ erro: "Item não encontrado" });

    // Atualiza mantendo o ID original
    db[recurso][index] = { ...db[recurso][index], ...req.body, id: Number(id) };
    res.json(db[recurso][index]);
});

// 5. DELETAR (DELETE) - Apaga um item
app.delete('/:recurso/:id', (req, res) => {
    const { recurso, id } = req.params;
    db[recurso] = db[recurso].filter(i => i.id != id);
    res.json({ sucesso: true });
});

app.listen(PORT, () => {
    console.log(`🎬 API de Cinema rodando em http://localhost:${PORT}`);
    console.log(`Categorias disponíveis: ${Object.keys(db).join(', ')}`);
});
