<script setup>
  import SidebarView from './components/SidebarView.vue';
  import NavbarView from './components/NavbarView.vue';
</script>

<template>
  <div class="app">
    <!-- Sidebar -->
    <SidebarView />
    <div class="right-app">
      <div class="navbar">
        <NavbarView />
      </div>
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
:root{
  overflow-y: auto;
  --primary : #ffd95a;
  --secondary : #C07F00;
  --light : #fff7d4;
  --dark : #4C3D3D;
  --lightgray : #d3d3d3;
}


::-webkit-scrollbar{
  width: 10px;
}

::-webkit-scrollbar-thumb{
  background-color: var(--lightgray);
  border-radius: 10px;

  &:hover{
    background-color: gray;
  }
}

* {
  margin : 0;
  box-sizing : border-box;
  font-family : 'Cabin' 
}

button{
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}


.app{
  display: flex;
  main {
    flex : 1 1 0;
    padding : 2rem;

		@media (max-width: 1440px) {
			padding-left: 6rem;
      
		}
  }
}

.right-app{
  width: 100%;
}

</style>
