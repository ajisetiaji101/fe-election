<template>
    <div class="bg-gray-50">
        <UContainer>
            <div class="h-screen flex flex-col items-center justify-center">
                <h1 class="text-black text-2xl font-bold">Hasil Pemilihan UMUM</h1>
                <p class="text-black text-lg mb-6">Hasil hanya bisa dilihat ketika pukul 00:00 WIB</p>
                <UButton class="mt-4" @click="redirectToHome">Kembali ke Beranda</UButton>
                <UDivider label="Progress Pemilihan Umum" :ui="{ container: { base: 'dark:text-gray-700 my-4' } }" />
                <div class="flex justify-around w-full max-w-4xl">
                    <div v-for="kandidatvote in listVoteResult"
                        class="flex flex-col items-center justify-center space-y-4">
                        <img src="~/assets/logo/lgnimg.png" alt="Gambar Pemilih"
                            class="w-24 h-24 rounded-full object-cover" />
                        <div class="text-center">
                            <h1 class="text-lg font-semibold text-black">{{ kandidatvote.candidate }}</h1>
                            <h1 class="text-2xl font-bold text-gray-800">Total Suara</h1>
                            <p class="text-4xl font-bold text-green-500">{{ kandidatvote.votes }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </UContainer>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const redirectToHome = () => {
    // Redirect ke halaman utama
    router.push({ name: 'siderole' }); // Ganti 'home' dengan nama route yang sesuai
}

interface VoteResult {
    candidate: string;
    votes: number;
}

let listVoteResult = ref<VoteResult[]>([]);

const fetchResult = async () => {
    // Lakukan fetch data dari API

    const { data } = await useFetch<{ response: { results: Record<string, number> } }>("/api/voteresult", {
        method: 'GET',
    });

    return data.value?.response?.results || null;
}

fetchResult().then((results) => {
    if (results) {
        // Convert results object to an array of key-value pairs
        const resultsArray = Object.entries(results).map(([candidate, votes]) => ({
            candidate,
            votes: Number(votes),
        }));

        listVoteResult.value = resultsArray;

        console.log("Results as an array:", resultsArray);
    } else {
        console.log("No results data returned from the API.");
    }
});


</script>

<style scoped>
/* Tamb ahkan gaya tambahan jika diperlukan */
</style>