<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
// import firebase_app from "@/plugins/firebase.client";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from 'firebase/auth';

definePageMeta({
  layout: false
});

const errorMessage = ref('');
const formSchema = toTypedSchema(
  z.object({
    user_name: z
      .string()
      .min(1, 'Username must be at least 1 characters.')
      .max(50, 'Username must be at most 50 characters.')
      .regex(
        /^\w+$/,
        'Username can only contain letters, numbers, and underscores.',
      ),
    email: z
      .string()
      .min(1, 'email must be at least 1 characters.')
      .max(50, 'email must be at most 50 characters.'),
    password: z
      .string()
      .min(1, 'password must be at least 1 characters.')
      .max(50, 'password must be at most 50 characters.')
  }),
)

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    user_name: '',
    email: '',
    password: ''
  },
})
const { $auth } = useNuxtApp();
const onSubmit = handleSubmit(async (data) => {
  const result = await createUserWithEmailAndPassword(
    $auth,
    data.email,
    data.password,
  ).then(async(res) => {
    await updateProfile(res.user, { displayName: data.user_name })
    localStorage.message = "新規登録に成功しました";
    navigateTo('/login');
  }).catch((err) => {
    // TODO: 実装
    errorMessage.value = "ユーザーの新規作成に失敗しました";
    console.error(err)
  })
})
</script>

<template>
  <h2 class="text-center pt-16 text-red-600" v-if="errorMessage">{{ errorMessage }}</h2>
  <Card class="w-full sm:max-w-md mt-4 m-auto mt-16">
    <CardHeader class="text-center">
      <CardTitle class="text-xl pt-2 pb-2">SignUp</CardTitle>
      <CardDescription>
        ユーザー情報をご入力ください
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form id="form-vee-input" @submit="onSubmit">
        <FieldGroup>
          <VeeField v-slot="{ field, errors }" name="user_name">
            <Field :data-invalid="!!errors.length">
              <Input
                id="form-vee-input-user-name"
                v-bind="field"
                :aria-invalid="!!errors.length"
                placeholder="Name"
                autocomplete="user_name"
              />
              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField>
          <VeeField v-slot="{ field, errors }" name="email">
            <Field :data-invalid="!!errors.length">
              <Input
                id="form-vee-input-email"
                v-bind="field"
                :aria-invalid="!!errors.length"
                placeholder="Email"
                autocomplete="email"
              />
              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField>

          <VeeField v-slot="{ field, errors }" name="password">
            <Field :data-invalid="!!errors.length">
              <Input
                id="form-vee-input-password"
                type="password"
                v-bind="field"
                :aria-invalid="!!errors.length"
                placeholder="Password"
                autocomplete="password"
              />
              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField>


        </FieldGroup>
      </form>
    </CardContent>
    <CardFooter class="m-auto">
      <Field orientation="horizontal">
        <Button type="button" variant="outline" @click="resetForm">
          Reset
        </Button>
        <Button type="submit" form="form-vee-input">
          SignUp
        </Button>
      </Field>
    </CardFooter>
  </Card>
  <div class="text-center text-sm mt-4">
    <NuxtLink to="/login" class="text-blue-400">ログインはこちら</NuxtLink>
  </div>
</template>