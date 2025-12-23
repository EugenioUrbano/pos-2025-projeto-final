<<<<<<< HEAD
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const db = {
    users: [
        { id: 1, name: "Ana Souza", username: "ana_dev", email: "ana.souza@tech.com" },
        { id: 2, name: "Carlos Oliveira", username: "carlos_manager", email: "carlos.adm@empresa.com" },
        { id: 3, name: "Beatriz Lima", username: "bia_design", email: "bia.lima@studio.com" }
    ],
    posts: [
        { userId: 1, id: 1, title: "Como começar com React em 2025", body: "O React continua sendo a biblioteca mais popular. Para iniciantes, recomendo focar fortemente no entendimento de Hooks (useState, useEffect) antes de pular para frameworks complexos como Next.js." },
        { userId: 2, id: 2, title: "Estratégias de Liderança Técnica", body: "Liderar um time de desenvolvimento exige mais do que conhecimento técnico. É necessário empatia, capacidade de delegar tarefas e uma visão clara sobre a arquitetura do software a longo prazo." },
        { userId: 3, id: 3, title: "A importância da UX no Mobile", body: "Em telas pequenas, cada pixel conta. A experiência do usuário deve ser fluida, com botões acessíveis e navegação intuitiva para garantir a retenção do usuário." }
    ],
    comments: [
        { postId: 1, id: 1, name: "Dúvida sobre Hooks", email: "dev.junior@gmail.com", body: "Ótimo artigo! Mas em qual cenário devo usar o useMemo em vez de apenas deixar o componente renderizar?" },
        { postId: 1, id: 2, name: "Parabéns!", email: "carlos.adm@empresa.com", body: "Muito bom, Ana. Vou compartilhar com a equipe de estagiários." },
        { postId: 2, id: 3, name: "Discordo em parte", email: "tech.lead@outro.com", body: "Acho que a arquitetura deve ser decisão do time todo, não só do líder." }
    ],
    albums: [
        { userId: 1, id: 1, title: "Viagem ao Japão" },
        { userId: 3, id: 2, title: "Portfolio de Design 2024" }
    ],
    photos: [
        { albumId: 1, id: 1, title: "Monte Fuji ao amanhecer", url: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600&q=80", thumbnailUrl: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=150&q=80" },
        { albumId: 1, id: 2, title: "Ruas de Tóquio à noite", url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&q=80", thumbnailUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=150&q=80" },
        { albumId: 2, id: 3, title: "Protótipo App Bancário", url: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&q=80", thumbnailUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=150&q=80" }
    ],
    todos: [
        { userId: 1, id: 1, title: "Revisar Pull Requests do time", completed: false },
        { userId: 1, id: 2, title: "Atualizar documentação da API", completed: true },
        { userId: 2, id: 3, title: "Reunião de alinhamento mensal", completed: true },
        { userId: 3, id: 4, title: "Entregar wireframes do novo site", completed: false }
    ]
};

const getNextId = (resource) => {
    const list = db[resource];
    if (!list || list.length === 0) return 1;
    return Math.max(...list.map(item => item.id)) + 1;
};

app.get('/:parent/:parentId/:child', (req, res) => {
    const { parent, parentId, child } = req.params;
    
    if (!db[child] || !db[parent]) return res.status(404).json({});

    const foreignKey = parent.slice(0, -1) + 'Id'; 
    const filteredData = db[child].filter(item => item[foreignKey] == parentId);
    
    res.json(filteredData);
});

app.get('/:resource', (req, res) => {
    const { resource } = req.params;
    const filters = req.query;

    if (!db[resource]) return res.status(404).json({});

    let data = db[resource];

    if (Object.keys(filters).length > 0) {
        data = data.filter(item => {
            let isValid = true;
            for (key in filters) {
                if (item[key] != filters[key]) isValid = false;
            }
            return isValid;
        });
    }

    res.json(data);
});

app.get('/:resource/:id', (req, res) => {
    const item = db[req.params.resource].find(i => i.id == req.params.id);
    if (!item) return res.status(404).json({});
    res.json(item);
});

app.post('/:resource', (req, res) => {
    const defaults = { userId: 1, postId: 1, albumId: 1 };
    const newItem = { 
        ...defaults,
        ...req.body, 
        id: getNextId(req.params.resource) 
    };
    db[req.params.resource].push(newItem);
    res.status(201).json(newItem);
});

app.put('/:resource/:id', (req, res) => {
    const { resource, id } = req.params;
    const index = db[resource].findIndex(i => i.id == id);
    if (index === -1) return res.status(404).json({});
    
    db[resource][index] = { ...req.body, id: Number(id) };
    res.json(db[resource][index]);
});

app.patch('/:resource/:id', (req, res) => {
    const { resource, id } = req.params;
    const index = db[resource].findIndex(i => i.id == id);
    if (index === -1) return res.status(404).json({});

    db[resource][index] = { ...db[resource][index], ...req.body };
    res.json(db[resource][index]);
});

app.delete('/:resource/:id', (req, res) => {
    const { resource, id } = req.params;
    db[resource] = db[resource].filter(i => i.id != id);
    res.json({ success: true });
});

app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
=======
>>>>>>> 8a0940301499c81b135af8d2dd0f318d1c1f0566
