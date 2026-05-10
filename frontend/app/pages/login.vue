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
  <div class="flex-1 flex flex-col lg:flex-row w-full h-[100dvh] overflow-hidden bg-[#4c5cb1] lg:bg-white border border-blue-900">
    
    <div class="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden border-r border-gray-100 bg-white">
      <img 
        src="../assets/images/background-login.jpg" 
        alt="Background Branding"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
      />
      <div class="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>
      
      <div class="relative z-10 p-12 text-center w-full max-w-2xl">
        <div class="bg-white/40 backdrop-blur-md border border-white/40 p-12 rounded-[40px] shadow-2xl">
          <div class="relative mb-10 animate-float">
            <img class="w-36 h-36 mx-auto rounded-[30px] object-cover shadow-xl border-4 border-white/20" src="../assets/images/logo-BuyStalk - caddie.jpg" alt="logo Buystalk" />
          </div>
          
          <h2 class="text-6xl font-black text-blue-900 mb-6 tracking-tighter italic">BuyStalk</h2>
          <p class="text-gray-700 text-3xl font-light leading-relaxed">
            Le réseau social marketplace nouvelle génération pour dénicher les meilleures opportunités.
          </p>
        </div>
      </div>
    </div>

    <div 
      class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-20 bg-[#4c5cb1] shadow-none lg:shadow-[-20px_0_50px_rgba(0,0,0,0.2)]"
    >
      <div class="w-full max-w-lg relative z-10 flex flex-col justify-center h-full py-8 lg:py-0"> 
        
        <div class="lg:hidden flex flex-col items-center mb-8 animate-fade-in">
          <img class="w-20 h-20 rounded-2xl object-cover shadow-2xl border-2 border-white/20 mb-3" src="../assets/images/logo-BuyStalk - caddie.jpg" alt="logo Buystalk" />
          <h2 class="text-3xl font-black text-white italic tracking-tighter">BuyStalk</h2>
        </div>

        <div class="mb-10 text-center lg:text-left">
          <h1 class="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">Bon retour !</h1>
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
            class="w-full bg-white text-[#4c5cb1] font-black py-5 px-4 rounded-2xl active:scale-[0.97] transition-all duration-300 shadow-xl text-lg mt-4 group relative overflow-hidden"
          >
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

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-float { animation: float 4s ease-in-out infinite; }
.animate-fade-in { animation: fadeIn 0.8s ease-out; }

/* On s'assure que le body ne scrolle pas quand cette page est montée */
:global(body) {
  overflow: hidden;
}
</style>