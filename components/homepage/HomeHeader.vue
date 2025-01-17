<template>
    <div>
        <nav class="bg-gray-100 py-4 shadow-md">
            <div class="container mx-auto flex items-center justify-between px-6">
                <!-- Logo Section -->
                <div class="flex items-center space-x-4">
                    <img src="~/assets/logo/BIE.png" alt="Logo" class="h-10 w-10 rounded-full" />
                    <h3 class="text-xl font-semibold text-gray-800">
                        Blockchain-based <br /> Indonesian Elections
                    </h3>
                </div>

                <!-- Navigation Links -->
                <ul class="hidden md:flex items-center space-x-8">
                    <li>
                        <h1 class="text-gray-800 font-semibold hover:text-blue-600 transition-all">
                            Beranda
                        </h1>
                    </li>
                    <li>
                        <h1 class="text-gray-600 hover:text-blue-600 transition-all">
                            Layanan
                        </h1>
                    </li>
                    <li>
                        <h1 class="text-gray-600 hover:text-blue-600 transition-all">
                            Tentang
                        </h1>
                    </li>
                </ul>

                <!-- Login Button -->
                <button @click="showModal = true"
                    class="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all">
                    Login
                </button>
            </div>
        </nav>
    </div>
    <ModalLogin :show="showModal" @close="showModal = false" />
</template>

<script setup>
import { ref } from 'vue';
import ModalLogin from '../login/ModalLogin.vue';


const showModal = ref(false);
</script>

<style scoped>
nav {
    font-family: 'Arial', sans-serif;
}
</style>