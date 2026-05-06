<script setup lang="ts">
const { login } = useAuth()
const email = ref('')
const password = ref('')
const message = ref('')

const handleLogin = async () => {
  const success = await login(email.value, password.value)
  if (success) {
    message.value = 'Connexion réussie !'
    navigateTo('/')
  } else {
    message.value = 'Email ou mot de passe incorrect'
  }
}
</script>

<template>
  <!-- Changement : On utilise flex-1 pour occuper tout l'espace et supprimer le vide au-dessus du footer -->
  <div class="flex-1 flex flex-col lg:flex-row w-full overflow-hidden">
    
    <!-- SECTION GAUCHE : Branding -->
    <div class="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden border-r border-gray-100 bg-white">
      
      <img 
        src="../assets/images/background-login.jpg" 
        alt="Background Branding"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
      />

      <div class="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>

      <!-- Effet de lumière -->
      <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] opacity-40"></div>

      <div class="relative z-10 p-12 text-center w-full max-w-xl">
        <div class="bg-white/40 backdrop-blur-md border border-white/40 p-12 rounded-[40px] shadow-2xl">
          <!-- Animation de flottement sur le logo -->
          <div class="relative mb-8 animate-float">
            <img class="w-32 h-32 mx-auto rounded-[30px] object-cover shadow-xl border-4 border-white/20" src="../assets/images/logo-BuyStalk - caddie.jpg" alt="logo Buystalk" />
            <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/10 rounded-full blur-md animate-shadow"></div>
          </div>
          
          <h2 class="text-6xl font-black text-blue-900 mb-6 tracking-tighter italic">BuyStalk</h2>
          <p class="text-gray-700 text-2xl font-light leading-relaxed">
            Le réseau social marketplace nouvelle génération pour dénicher les meilleures opportunités.
          </p>
        </div>
      </div>
    </div>

    <!-- SECTION DROITE : Connexion -->
    <div 
      class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.2)]" 
      style="background-color: #4c5cb1;"
    >
      <!-- Effets de lumière internes -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-white rounded-full blur-[150px] opacity-10"></div>
        <div class="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-900 rounded-full blur-[150px] opacity-20"></div>
      </div>

      <div class="w-full max-w-lg relative z-10"> 
        <div class="mb-10 text-center lg:text-left">
          <h1 class="text-5xl font-black text-white mb-4 tracking-tight">Bon retour !</h1>
          <p class="text-xl text-indigo-50 font-medium opacity-90">Connectez-vous pour continuer.</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="group">
            <label class="block text-sm font-bold text-white mb-2 ml-1">Adresse Email</label>
            <input 
              v-model="email" 
              type="email" 
              class="w-full px-5 py-4 rounded-2xl border-2 border-white/20 focus:border-white focus:ring-0 outline-none transition-all bg-white/10 text-white text-lg placeholder:text-white/40" 
              placeholder="login@example.fr" 
              required 
            />
          </div>
          
          <div class="group">
            <div class="flex justify-between items-center mb-2 ml-1">
              <label class="text-sm font-bold text-white">Mot de passe</label>
              <a href="#" class="text-sm text-indigo-100 hover:text-white font-bold transition-colors">Oublié ?</a>
            </div>
            <input 
              v-model="password" 
              type="password" 
              class="w-full px-5 py-4 rounded-2xl border-2 border-white/20 focus:border-white focus:ring-0 outline-none transition-all bg-white/10 text-white text-lg placeholder:text-white/40" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <button 
          type="submit" 
          class="w-full bg-white text-[#4c5cb1] font-black py-5 px-4 rounded-2xl 
                hover:bg-[#4c5cb1] hover:text-white hover:ring-4 hover:ring-white/30 
                transition-all duration-500 ease-out shadow-xl hover:shadow-[#4c5cb1]/40 
                active:scale-[0.97] text-lg mt-4 group relative overflow-hidden"
        >
          <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
          
          <span class="relative z-10">Se connecter</span>
        </button>

        </form>
        
        <div v-if="message" class="mt-8 p-5 bg-red-500/20 text-white rounded-2xl text-center font-bold border border-white/20 backdrop-blur-sm">
          {{ message }}
        </div>

        <p class="mt-10 text-center text-lg text-white/90 font-medium">
          Pas encore de compte ? 
          <NuxtLink to="/register" class="text-white hover:text-indigo-100 font-black decoration-2 underline-offset-8">S'inscrire gratuitement</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

@keyframes shadow {
  0% { transform: translateX(-50%) scale(1); opacity: 0.1; }
  50% { transform: translateX(-50%) scale(1.2); opacity: 0.05; }
  100% { transform: translateX(-50%) scale(1); opacity: 0.1; }
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-shadow {
  animation: shadow 4s ease-in-out infinite;
}
</style>