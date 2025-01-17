<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white rounded-lg shadow-lg w-96">
            <!-- Modal Header -->
            <div class="flex justify-between items-center border-b px-6 py-4">
                <h3 class="text-lg font-semibold text-gray-800">Masuk Sebagai Pengawas Pemilu</h3>
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
                    &times;
                </button>
            </div>

            <!-- Modal Body -->
            <div class="p-6">
                <div>
                    <img src="~/assets/logo/BIE.png" alt="Logo" class="h-10 w-10 rounded-full mx-auto" />
                </div>
                <form @submit.prevent="handleLogin">
                    <div class="mb-4">
                        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                        <input v-model="email" id="email" type="email"
                            class="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter your email" required />
                    </div>

                    <div class="mb-4">
                        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                        <input v-model="password" id="password" type="password"
                            class="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter your password" required />
                    </div>

                    <div class="flex justify-end">
                        <button type="submit"
                            class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all">
                            Masuk
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    show: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(['close']);

const email = ref('rijal.asep.nugroho@gmail.com');
const password = ref('qwertyuiop!1Q');

const handleLogin = async () => {
    // Implement login logic here
    // console.log('Email:', email.value);
    // console.log('Password:', password.value);

    const { data } = await useFetch("/api/loginpengawas", {
        method: 'POST',
        body: JSON.stringify({
            email: email.value,
            password: password.value,
        }),
    });

    if (data.value.status === 200) {
        emit('close');
        await navigateTo('/siderole');
    } else {
        alert('Email atau Password Salah');
    }
};
</script>

<style scoped>
.fixed {
    backdrop-filter: blur(5px);
}
</style>