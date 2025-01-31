<template>
    <div class="bg-gray-50">
        <UContainer>
            <div class="flex w-full h-screen p-6 items-center justify-around">
                <UCard :ui="{ background: 'dark:bg-white' }">
                    <div class="flex flex-col items-center justify-center space-y-4">
                        <img src="~/assets/logo/2133124.png" alt="Gambar Pemilih"
                            class=" w-60 h-60 rounded-full object-cover" />
                        <UButton @click="handlePengawas"
                            class="w-full py-3 text-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 rounded-lg"
                            block>
                            Pengawas</UButton>
                    </div>
                </UCard>

                <UCard :ui="{ background: 'dark:bg-white' }">
                    <div class="flex flex-col items-center justify-center space-y-4">
                        <img src="~/assets/logo/lgnimg.png" alt="Gambar Kandidat"
                            class="w-60 h-60 rounded-full object-cover" />
                        <UButton @click="handlePemilih"
                            class="w-full py-3 text-lg font-semibold bg-green-500 text-white hover:bg-green-600 rounded-lg"
                            block>
                            Pemilih</UButton>
                    </div>
                </UCard>
            </div>
        </UContainer>
    </div>
</template>

<script setup lang="ts">

const handlePemilih = () => {
    navigateTo('/pemilih');
}

const handlePengawas = async () => {

    const { data, error } = await useFetch("/api/openvote", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    console.log("data", data.value?.status);

    if (data.value?.status === 200) {
        navigateTo('/pengawas');
    } else {
        alert("Voting belum dibuka");
    }
}

</script>

<style scoped>
/* Tambahkan gaya tambahan jika diperlukan */
</style>
