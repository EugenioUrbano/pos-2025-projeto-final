import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Layout, Users, FileText, MessageSquare, Image, Film, 
  CheckSquare, Plus, Search, Edit2, Trash2, X, Save, CheckCircle, User, Link 
} from 'lucide-react';
import './App.css';

const API_URL = 'http://localhost:3001';

function App() {
  const [resource, setResource] = useState('posts');
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [userIdFilter, setUserIdFilter] = useState('');

  const [usersList, setUsersList] = useState([]);
  const [postsList, setPostsList] = useState([]);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const menuItems = [
    { id: 'posts', label: 'Posts', icon: <FileText size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'todos', label: 'To-Dos', icon: <CheckSquare size={20} /> },
    { id: 'albums', label: 'Albums', icon: <Film size={20} /> },
    { id: 'photos', label: 'Photos', icon: <Image size={20} /> },
    { id: 'comments', label: 'Comments', icon: <MessageSquare size={20} /> },
  ];

  useEffect(() => {
    axios.get(`${API_URL}/users`)
      .then(res => setUsersList(res.data))
      .catch(err => console.error("Erro users"));

    axios.get(`${API_URL}/posts`)
      .then(res => setPostsList(res.data))
      .catch(err => console.error("Erro posts"));
  }, []);

  useEffect(() => {
    fetchData();
  }, [resource, userIdFilter]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const url = userIdFilter 
        ? `${API_URL}/${resource}?userId=${userIdFilter}` 
        : `${API_URL}/${resource}`;
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      showNotify("Erro ao conectar na API", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showNotify = (msg) => {
    setNotification(msg);
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const isNumberField = ['userId', 'postId', 'albumId'].includes(e.target.name);
    const finalValue = isNumberField ? Number(value) : value;
    
    setFormData({ ...formData, [e.target.name]: finalValue });
  };

  const openModal = (item = {}) => {
    setFormData(item);
    setEditingId(item.id || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({});
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.patch(`${API_URL}/${resource}/${editingId}`, formData);
        showNotify("Item atualizado!");
      } else {
        await axios.post(`${API_URL}/${resource}`, formData);
        showNotify("Item criado!");
      }
      fetchData();
      closeModal();
    } catch (error) {
      showNotify("Erro ao salvar.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      try {
        await axios.delete(`${API_URL}/${resource}/${id}`);
        fetchData();
        showNotify("Item deletado.");
      } catch (error) {
        showNotify("Erro ao deletar.");
      }
    }
  };

  
  const UserSelect = () => (
    <div className="form-group">
      <label style={{fontSize:'0.85rem', color:'#94a3b8', marginBottom:'5px', display:'block'}}>Autor (Usuário)</label>
      <div style={{position:'relative'}}>
        <User size={16} style={{position:'absolute', left:'12px', top:'38px', color:'#64748b'}}/>
        <select 
          name="userId" 
          value={formData.userId || ''} 
          onChange={handleInputChange}
          style={{paddingLeft: '35px', appearance: 'none', cursor:'pointer'}}
          required
        >
          <option value="">Selecione um usuário...</option>
          {usersList.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>
    </div>
  );


  const PostSelect = () => (
    <div className="form-group">
      <label style={{fontSize:'0.85rem', color:'#94a3b8', marginBottom:'5px', display:'block'}}>Referente ao Post</label>
      <div style={{position:'relative'}}>
        <FileText size={16} style={{position:'absolute', left:'12px', top:'38px', color:'#64748b'}}/>
        <select 
          name="postId" 
          value={formData.postId || ''} 
          onChange={handleInputChange}
          style={{paddingLeft: '35px', appearance: 'none', cursor:'pointer'}}
          required
        >
          <option value="">Selecione um Post...</option>
          {postsList.map(p => (
            <option key={p.id} value={p.id}>Post #{p.id}: {p.title.substring(0, 30)}...</option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderFormInputs = () => {
    switch (resource) {
      case 'users': return (
        <>
          <div className="form-group"><input name="name" placeholder="Nome Completo" value={formData.name || ''} onChange={handleInputChange} required /></div>
          <div className="form-group"><input name="username" placeholder="Username" value={formData.username || ''} onChange={handleInputChange} /></div>
          <div className="form-group"><input name="email" placeholder="Email" value={formData.email || ''} onChange={handleInputChange} /></div>
        </>
      );
      case 'comments': return (
        <>
          <PostSelect /> 
          <div className="form-group"><input name="name" placeholder="Título do Comentário" value={formData.name || ''} onChange={handleInputChange} required /></div>
          <div className="form-group"><input name="email" placeholder="Email do Autor" value={formData.email || ''} onChange={handleInputChange} required /></div>
          <div className="form-group"><textarea name="body" rows="3" placeholder="Comentário..." value={formData.body || ''} onChange={handleInputChange} required /></div>
        </>
      );
      case 'todos': return (
        <>
          <UserSelect />
          <div className="form-group"><input name="title" placeholder="Tarefa a fazer" value={formData.title || ''} onChange={handleInputChange} required /></div>
          <div className="form-group" style={{display:'flex', alignItems:'center', gap:'10px', color:'white'}}>
            <input type="checkbox" name="completed" checked={formData.completed || false} onChange={handleInputChange} style={{width:'20px', height:'20px'}}/>
            <label>Concluída?</label>
          </div>
        </>
      );
      case 'photos': return (
        <>
          <UserSelect />
          <div className="form-group"><input name="title" placeholder="Título da Foto" value={formData.title || ''} onChange={handleInputChange} required /></div>
          <div className="form-group"><input name="url" placeholder="URL da Imagem" value={formData.url || ''} onChange={handleInputChange} /></div>
        </>
      );
      case 'posts': return (
        <>
          <UserSelect />
          <div className="form-group"><input name="title" placeholder="Título do Post" value={formData.title || ''} onChange={handleInputChange} required /></div>
          <div className="form-group"><textarea name="body" rows="4" placeholder="Conteúdo..." value={formData.body || ''} onChange={handleInputChange} /></div>
        </>
      );
      default: return (
        <>
          <UserSelect />
          <div className="form-group"><input name="title" placeholder="Título" value={formData.title || ''} onChange={handleInputChange} required /></div>
        </>
      );
    }
  };

  return (
    <div className="app-layout">
      
      <aside className="sidebar">
        <div className="logo">⚡ NexusAdmin</div>
        <nav>
          {menuItems.map(item => (
            <button key={item.id} className={`nav-item ${resource === item.id ? 'active' : ''}`} onClick={() => setResource(item.id)}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="header-bar">
          <div className="search-bar">
            <Search size={18} />
            <input type="number" placeholder="Filtrar por User ID..." value={userIdFilter} onChange={(e) => setUserIdFilter(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={() => openModal({})}>
            <Plus size={20} /> Novo {resource.slice(0, -1)}
          </button>
        </header>

        <h2 style={{marginBottom: '20px', fontSize: '1.8rem', display:'flex', alignItems:'center', gap:'10px'}}>
          {menuItems.find(i => i.id === resource)?.icon}
          {resource.charAt(0).toUpperCase() + resource.slice(1)}
        </h2>

        {isLoading && <div style={{textAlign:'center', padding:'20px', opacity:0.7}}>Carregando dados...</div>}

        <div className="grid-container">
          {data.map(item => (
            <div key={item.id} className="glass-card">
              
              {resource === 'photos' && item.url && (
                <div style={{width:'100%', height:'150px', backgroundImage:`url(${item.url})`, backgroundSize:'cover', backgroundPosition:'center', borderRadius:'8px', marginBottom:'15px'}} />
              )}

              <div style={{flex: 1}}>
                <div className="card-title">
                  {item.title || item.name}
                  {resource === 'todos' && (
                    <span style={{fontSize:'0.7rem', marginLeft:'8px', padding:'2px 8px', borderRadius:'10px', background: item.completed ? '#10b981' : '#f59e0b', color:'black', fontWeight:'bold'}}>
                      {item.completed ? 'Feito' : 'Pendente'}
                    </span>
                  )}
                </div>
                
                <div className="card-meta">
                  {resource === 'users' && <>@{item.username} • {item.email}</>}
                  {resource === 'posts' && item.body?.substring(0, 100) + '...'}
                  {resource === 'comments' && `"${item.body?.substring(0, 80)}..."`}
                  
                  <div style={{display:'flex', gap:'5px', flexWrap:'wrap'}}>
                    {item.userId && (
                      <div style={{marginTop:'10px', display:'flex', alignItems:'center', gap:'5px', color: '#94a3b8', fontSize:'0.8rem', background:'rgba(255,255,255,0.05)', padding:'4px 8px', borderRadius:'4px', width:'fit-content'}}>
                        <User size={12} /> User: {item.userId}
                      </div>
                    )}
                    {item.postId && (
                      <div style={{marginTop:'10px', display:'flex', alignItems:'center', gap:'5px', color: '#94a3b8', fontSize:'0.8rem', background:'rgba(99, 102, 241, 0.1)', padding:'4px 8px', borderRadius:'4px', width:'fit-content'}}>
                        <FileText size={12} /> Post: {item.postId}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="card-actions">
                <button className="icon-btn" onClick={() => openModal(item)} title="Editar"><Edit2 size={18} /></button>
                <button className="icon-btn danger" onClick={() => handleDelete(item.id)} title="Excluir"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
        
        {!isLoading && data.length === 0 && <div style={{textAlign:'center', padding:'50px', opacity:0.5}}><Layout size={48} /><p>Nenhum item encontrado.</p></div>}
      </main>

      {isModalOpen && (
        <div className="modal-overlay" onClick={(e) => {if(e.target.className === 'modal-overlay') closeModal()}}>
          <div className="modal-content">
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px', alignItems:'center'}}>
              <h3 style={{margin:0}}>{editingId ? 'Editar Item' : 'Criar Novo'}</h3>
              <button onClick={closeModal} style={{background:'none', border:'none', color:'#94a3b8', cursor:'pointer'}}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit}>
              {renderFormInputs()}
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn-submit"><Save size={16} style={{marginRight:'5px', verticalAlign:'middle'}}/> Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {notification && <div className="toast"><CheckCircle size={20} />{notification}</div>}
    </div>
  );
}

export default App;