<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
// import { toast } from 'vue-sonner'
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

definePageMeta({
  layout: false,
  middleware: ['guest'],
})


const authStore = useAuthStore()
const message = ref('')
const errorMessage = ref('')

onMounted(() => {
  if (localStorage.message) {
    message.value = localStorage.message
    localStorage.message = ''
  }
})

const formSchema = toTypedSchema(
  z.object({
    email: z
      .string()
      .min(1, 'Email must be at least 1 characters.')
      .max(50, 'Email must be at most 50 characters.'),
    password: z
      .string()
      .min(1, 'Password must be at least 1 characters.')
      .max(50, 'Password must be at most 50 characters.')
  }),
)

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    email: '',
    password: ''
  },
})

const onSubmit = handleSubmit(async (data) => {
  errorMessage.value = ''
  const { user, error } = await authStore.login(data.email, data.password)
  if (error || !user) {
    errorMessage.value = 'ログインに失敗しました'
    console.error(error)
    return
  }
  const redirect = useCookie('redirect')
  const redirectPath = redirect.value || '/'
  redirect.value = null
  navigateTo(redirectPath)
})
</script>

<template>
  <h2 class="text-center pt-16" v-if="message">{{ message }}</h2>
  <h2 class="text-center pt-16 text-red-600" v-if="errorMessage">{{ errorMessage }}</h2>
  <Card class="w-full sm:max-w-md mt-4 m-auto mt-16">
    <CardHeader class="text-center">
      <CardTitle class="text-xl pt-2 pb-2">Login</CardTitle>
      <CardDescription>
        ユーザー情報をご入力ください
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form id="form-vee-input" @submit="onSubmit">
        <FieldGroup>


          <VeeField v-slot="{ field, errors }" name="email">
            <Field :data-invalid="!!errors.length">
              <!-- <FieldLabel for="form-vee-input-username">
              </FieldLabel> -->
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
              <!-- <FieldLabel for="form-vee-input-username">
              </FieldLabel> -->
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
          Login
        </Button>
      </Field>
    </CardFooter>
  </Card>
  <div class="text-center text-sm mt-4">
    <NuxtLink to="/signup" class="text-blue-400">会員登録はこちら</NuxtLink>
  </div>
</template>