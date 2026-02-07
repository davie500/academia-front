<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="brand-title">FITFORCE</router-link>
    </div>

    <div class="navbar-menu">
      <div class="navbar-start">
        <router-link class="navbar-item" to="/notes">ANOTAÇÕES</router-link>
        <router-link class="navbar-item" to="/trainers">TREINADORES</router-link>
         <a class="navbar-item" href="/perfil">PERFIL</a>
      </div>

      <div class="navbar-end">
        <div class="buttons">
          <router-link class="button is-primary" to="/login">
            LOGIN
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<style>
.navbar {
  background-image: linear-gradient(to right, #dd0909, #e18e12);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.navbar-brand {
  font-weight: bold;
}
.brand-title {
  margin: 0;
  font-size: 1.5rem;
  color: white;
  text-decoration: none;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.navbar-menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  gap: 2rem;
  flex-wrap: wrap;
}
.navbar-start {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}
.navbar-end {
  display: flex;
  align-items: center;
}
.navbar-item {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}
.navbar-item:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
.buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}
.is-primary {
  background-color: #000000;
  color: white;
}
.is-primary:hover {
  background-color: #333333;
}
.is-light {
  background-color: #ffffff;
  color: #000000;
}
.is-light:hover {
  background-color: #e8e8e8;
}
</style>