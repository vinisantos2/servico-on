# servico-on - App de Conexão entre Clientes e Parceiros de Serviços

O **ServicoOn** é um aplicativo desenvolvido em **React Native com Firebase** que conecta clientes a prestadores de serviços (parceiros). Ele permite que usuários encontrem parceiros cadastrados, visualizem seus perfis, serviços e avaliações, e futuramente poderão agendar atendimentos diretamente pelo app.

---

## 🚀 Funcionalidades Implementadas

### 🔐 Autenticação
- Login e cadastro de usuários via Firebase Authentication.
- Diferenciação entre cliente e parceiro.

### 👤 Perfil do Parceiro
- Exibição da imagem, nome, descrição e avaliação do parceiro.
- Localização (latitude/longitude).
- Listagem dos serviços cadastrados pelo parceiro.
- Visualização pública para clientes.

### 📄 Serviços
- Serviços vinculados a parceiros.
- Listagem com nome, descrição e preço.

### 🔍 Integração com Firebase
- Firestore como banco de dados em tempo real.
- Uploads e atualizações dinâmicas de dados.

---

## 🧪 Protótipos e Telas
- Tela de login/cadastro.
- Tela de perfil do parceiro com dados dinâmicos.
- Tela para avaliação (em construção).
- Tela de listagem de serviços.

---

## 📦 Tecnologias Utilizadas

- **React Native + Expo**
- **Firebase (Auth + Firestore)**
- **TypeScript**
- **React Navigation**
- **Componentes customizados com estilos próprios**

---

## 📌 Funcionalidades Faltantes / Melhorias Futuras

### 🔜 Funcionalidades a implementar

- [ ] Tela de **edição de perfil do parceiro** (nome, descrição, localização, imagem, etc).
- [ ] Upload de imagem de perfil com Firebase Storage.
- [ ] Tela para o parceiro **cadastrar/editar/remover serviços**.
- [ ] Tela/modal para **cliente avaliar** um parceiro (com nota e comentário).
- [ ] **Agendamento de serviços** entre clientes e parceiros.
- [ ] Integração com **geolocalização e mapa** (ex: Google Maps).
- [ ] Exibição de **comentários e feedbacks** dos clientes.
- [ ] Melhorias visuais e usabilidade (design, navegação, animações).
- [ ] Separar interfaces de usuário entre cliente e parceiro.

---

## 🧑‍💻 Como rodar o projeto localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/vinisantos2/servico-on
   cd servico-on

   npm install

   npx expo start




