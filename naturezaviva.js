//instalando programas
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
 
//configurando o roteamento para teste no postman
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const port = 3001;
 
//configurando o acesso ao mongodb
mongoose.connect('mongodb://127.0.0.1:27017/naturezaviva',
{   useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS : 20000
});
 
//criando a model do seu projeto
const usuarioSchema = new mongoose.Schema({
    email : {type : String, Required : true},
    senha : {type : String}
});
const Usuario = mongoose.model("Usuario", usuarioSchema);
 
//criando a segunda model
const produtoNaturezaSchema = new mongoose.Schema({
    id_produtonatureza : {type : String, Required : true},
    descricao : {type : String},
    marca : {type : String},
    dataFabricacao : {type : Date},
    quantidadeEstoque : {type : Number}
});
const Produtonatureza = mongoose.model("Produtonatureza", produtoNaturezaSchema);
 
//configurando os roteamentos
app.post("/cadastrousuario", async(req, res)=>{
    const email = req.body.email;
    const senha = req.body.senha;
 
    //Ac Js
    if(email == null || senha == null){
        return res.status(400).json({error: "Preencha todos os dados.."})
    }
    const emailExistente = await Usuario.findOne({email:email})
    if(emailExistente){
        return res.status(400).json({error : "O e-mail cadastrado já existe!!"})
    }
 
    //mandando para banco
    const usuario = new Usuario({
        email : email,
        senha : senha
    })
 
    try{
        const newUsuario = await usuario.save();
        res.json({error : null, msg : "Cadastro ok", usuarioId : newUsuario._id});
    } catch(error){
        res.status(400).json({error});
    }
});
 
app.post("/cadastroprodutonatureza", async(req, res)=>{
    const id_produtonatureza = req.body.id_produtonatureza;
    const descricao = req.body.descricao;
    const marca = req.body.marca;
    const dataFabricacao = req.body.dataFabricacao;
    const quantidadeEstoque = req.body.quantidadeEstoque
 
    //Ac Js
    if(quantidadeEstoque <= 0 || quantidadeEstoque > 28){
        return res.status(400).json({error: "Estoque so é posivel de 0 até 28.."})
    }
 
    //mandando para banco
    const produtonatureza = new Produtonatureza({
        id_produtonatureza : id_produtonatureza,
        descricao : descricao,
        marca : marca,
        dataFabricacao : dataFabricacao,
        quantidadeEstoque : quantidadeEstoque
    })
 
    try{
        const newProdutonatureza = await produtonatureza.save();
        res.json({error : null, msg : "Cadastro ok", produtonaturezaId : newProdutonatureza._id});
    } catch(error){
        res.status(400).json({error});
    }
});
 
//rota para o get de cadastro
app.get("/cadastrousuario", async(req, res)=>{
    res.sendFile(__dirname +"/cadastrousuario.html");
})
 
//rota para o get de cadastro
app.get("/cadastroprodutonatureza", async(req, res)=>{
    res.sendFile(__dirname +"/cadastroprodutonatureza.html");
})
 
//rota raiz - inw
app.get("/", async(req, res)=>{
    res.sendFile(__dirname +"/index.html");
})
 
//configurando a porta
app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
})