<template>
    <div class="bg-gray-50">
        <div class="container mx-auto">
            <USection>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 relative h-[75rem]">
                    <div class="flex flex-col justify-center">
                        <h2 class="text-4xl font-bold text-gray-800">
                            Pemilihan Indonesia Bersih dan Aman
                        </h2>
                        <p class="mt-4 text-gray-600 text-lg">
                            Pastikan pilihanmu aman dan tidak dimanipulasi, dengan Sistem Pemilu berbasis Blockchain.
                        </p>
                        <div class="mt-8">
                            <UButton
                                class="px-6 py-3 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
                                Get Started
                            </UButton>
                        </div>
                    </div>
                    <div class="flex justify-center items-center">
                        <img src="~/assets/logo/elec1.png" alt="Voting Illustration" class="max-w-full h-auto" />
                    </div>
                </div>
            </USection>
        </div>
    </div>
</template>

<style scoped>
/* Pastikan tidak ada padding/margin tambahan di pembungkus */
.w-full img {
    object-fit: cover;
    /* Menyesuaikan tampilan gambar */
}
</style>