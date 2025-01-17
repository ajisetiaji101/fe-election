<script setup lang="ts">
import { string, mixed, type InferType, object } from 'yup'
import type { FormSubmitEvent } from '#ui/types'
import log from '~/server/middleware/log';

const schema = object({
    fingerprint: mixed().nullable()
        .test('fileSize', 'File is too large', (value) => {
            if (value) {
                return (value as File).size <= 2000000; // 2MB
            }
            return true;
        })
        .test('fileType', 'Only image files are allowed', (value) => {
            if (value) {
                return ['image/jpeg', 'image/png', 'image/jpg'].includes((value as File).type);
            }
            return true;
        })
})

type Schema = InferType<typeof schema>

interface ApiResponse {
    status: number;
    response?: any; // Adjust the type of response as needed
}

const state = reactive({
    nik: undefined,
    fingerprint: undefined as File | undefined
})

watch(() => state.fingerprint, (value) => {
    console.log(value);
    console.log("data state", state);

})

function handleFileChange(event: FileList) {


    console.log("input", event.item(0));

    const file = event.item(0);
    if (file) {
        state.fingerprint = file;
    }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {

    let data: { data: { value: ApiResponse } } | null = null

    if (state.nik !== undefined) {

        data = await useFetch("/api/loginpemilihbynik", {
            method: 'POST',
            body: JSON.stringify({
                nik: state.nik
            }),
        });

        console.log("data", data.data.value?.response as any);


        if (data.data.value?.status === 200) {
            // simpan di localsotrage
            localStorage.setItem('pemilih', JSON.stringify(data.data.value.response));
            navigateTo('/pemilih/pilihsuara');
        } else {
            alert('NIK tidak ditemukan');
        }

    } else {
        const formData = new FormData();
        formData.append('file', state.fingerprint as File);

        data = await useFetch("/api/loginpemilih", {
            method: 'POST',
            body: formData,
        });

        if (data.data.value?.status === 200) {
            // simpan di localsotrage
            localStorage.setItem('pemilih', JSON.stringify(data.data.value.response));
            navigateTo('/pemilih/pilihsuara');
        } else {
            alert('Fingerprint tidak ditemukan');
        }
    }

    // navigateTo('pemilih/pilihsuara');
    // Do something with event.data
}
</script>

<template>
    <div class="bg-gray-50 h-screen flex items-center">
        <UContainer>
            <img src="~/assets/logo/lgnimg.png" alt="Pemilih"
                class="w-36 h-36 rounded-full object-cover mx-auto mb-10" />
            <UForm :schema="schema" :state="state" class="space-y-6 max-w-lg mx-auto" @submit="onSubmit">

                <!-- Email Input -->
                <UFormGroup label="Nomor Induk Kependudukan (NIK) /" name="nik"
                    :ui="{ label: { base: 'dark:text-gray-700' } }">
                    <h1 class=" text-black font-thin my-2 text-sm">Nomor NIK yang tercantum Pada Kartu Keluarga (KK)
                        <span class="text-red-500">*</span>
                    </h1>
                    <UInput v-model="state.nik" placeholder="Masukkan NIK" class="w-full mb-3" />


                    <!-- Fingerprint Upload (Optional) -->
                    <UFormGroup name="fingerprint" :ui="{ label: { base: 'dark:text-gray-700' } }">
                        <h1 class=" text-black font-thin my-2 text-sm font-bold">Upload Sidik Jari <span
                                class="text-red-500">*</span></h1>
                        <div class="flex flex-col items-center">
                            <UInput type="file" accept="image/png, image/jpeg" @change="handleFileChange"
                                class="w-full mb-3" icon="i-heroicons-folder" />
                            <p class="text-sm text-gray-500">Upload a clear image of your fingerprint. (Max size: 2MB)
                            </p>
                        </div>
                    </UFormGroup>

                </UFormGroup>

                <!-- Submit Button -->
                <UButton type="submit" class="w-full py-3 bg-blue-500 text-white hover:bg-blue-600 rounded-lg" block>
                    MASUK
                </UButton>
            </UForm>
        </UContainer>
    </div>
</template>

<style scoped></style>
