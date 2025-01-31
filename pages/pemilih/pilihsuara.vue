<template>
    <div class="bg-gray-50">
        <UContainer>
            <div class="h-screen flex flex-col items-center justify-center">
                <h1 class="text-black text-2xl font-bold">Selamat Datang {{ pemilih }}</h1>
                <p class="text-black text-lg mb-6">Silahkan pilih sesuai hak suara anda!</p>
                <div class="flex justify-around w-full max-w-4xl">
                    <div v-for="kandidat in kandidats" class="flex flex-col items-center justify-center space-y-4">
                        <img src="~/assets/logo/logopejabat.png" alt="Gambar Pemilih" class="w-24 object-cover" />
                        <h1 class="text-lg font-semibold text-black">{{ kandidat.GubernurName }}</h1>
                        <h1 class="text-lg font-semibold text-black">{{ kandidat.WakilGubernurName }}</h1>
                        <h2 class="text-md font-semibold text-black">{{ kandidat.Visi }}</h2>
                        <img :src="kandidat.FotoPartai" alt="Gambar Partai" class="h-24 object-cover" />
                        <h1 class="text-lg font-semibold text-black">{{ kandidat.Partai }}</h1>
                        <UButton block
                            class="w-full py-3 text-lg font-semibold bg-green-500 text-white hover:bg-green-600 rounded-lg"
                            @click="openModal(kandidat.KandidatId)">
                            Coblos
                        </UButton>
                    </div>
                </div>
                <!-- Button Logout -->
                <UButton block :ui="{ base: 'dark:bg-red-500' }"
                    class=" w-24 py-3 text-lg font-semibold bg-red-500 text-white hover:bg-red-600 rounded-lg mt-4"
                    @click="redirectToHome">
                    Logout
                </UButton>
            </div>
        </UContainer>

        <!-- Modal Konfirmasi -->
        <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-lg shadow-lg p-6 w-1/3">
                <h2 class="text-lg font-semibold mb-4 text-gray-900">Konfirmasi</h2>
                <p class="text-gray-700">Apakah Anda yakin ingin mencoblos?</p>
                <div class="flex justify-end mt-4">
                    <UButton class="mr-2" @click="confirmCoblos">Ya</UButton>
                    <UButton variant="outline" @click="closeModal">Tidak</UButton>
                </div>
            </div>
        </div>

        <!-- Pesan Terima Kasih -->
        <div v-if="isThankYouVisible"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-lg shadow-lg p-6 w-1/3 text-center">
                <h2 class="text-lg font-semibold mb-4 text-gray-900">Terima Kasih!</h2>
                <p class="text-gray-700">Terima kasih telah menggunakan hak suara Anda.</p>
                <UButton class="mt-4" @click="redirectToHome">Kembali ke Beranda</UButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isModalOpen = ref(false);
const isThankYouVisible = ref(false);

interface ApiResponse {
    status: number;
    response?: any; // Adjust the type of response as needed
}

const state = reactive({
    idKandidat: '',
})

interface ApiKandidat {
    KandidatId: string;
    GubernurName: string;
    WakilGubernurName: string;
    Partai: string;
    Visi: string;
    FotoPartai: string;
    Foto: string;
}



const openModal = (candidateId: string) => {
    isModalOpen.value = true;
    state.idKandidat = candidateId;
}

const closeModal = () => {
    isModalOpen.value = false;
}
const confirmCoblos = async () => {
    try {
        // Retrieve voter ID from local storage (only on the client side)
        const voter = process.client ? JSON.parse(localStorage.getItem('pemilih') || '{}') : null;
        const voterId = voter?.pemilih_id;

        console.log("Voter ID:", voterId);
        console.log("Candidate ID:", state.idKandidat);

        if (!voterId || !state.idKandidat) {
            console.error("Voter ID or Candidate ID is missing.");
            return;
        }

        // Send POST request to the API
        const { data, error } = await useFetch("/api/votekandidat", {
            method: 'POST',
            body: JSON.stringify({
                voter_id: voterId,
                candidate_id: state.idKandidat,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 7200000,
        });

        if (data.value?.status !== 201) {
            alert('Anda sudah mencoblos');
            return;
        }



        // Hide modal and show thank-you message
        isModalOpen.value = false;
        isThankYouVisible.value = true;

        console.log("Vote successfully recorded:", data);
    } catch (err) {
        console.error("Unexpected error:", err);
    }
};


const redirectToHome = () => {

    // Hapus data pemilih dari local storage
    process.client && localStorage.removeItem('pemilih');

    // Redirect ke halaman utama
    router.push({ name: 'pemilih' }); // Ganti 'home' dengan nama route yang sesuai
}

//get name from localstorage
const pemilih = process.client ? JSON.parse(localStorage.getItem('pemilih') || '{}').nama : null;

//fetch kandidat
const kandidats = ref<ApiKandidat[]>([]);

//fetch kandidat
const fetchKandidat = async () => {
    const { data } = await useFetch("/api/kandidat", {
        method: 'GET',
    });

    let reponsedata = data.value as ApiResponse;

    if (reponsedata.status === 200) {
        kandidats.value = reponsedata.response;

    } else {
        alert('Data kandidat tidak ditemukan');
    }
}

fetchKandidat();

</script>

<style scoped>
/* Tamb ahkan gaya tambahan jika diperlukan */
</style>