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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

definePageMeta({
  layout: false
});


// TODO: 状態管理実装？
const message = ref('');

onMounted(() => {
  if (localStorage.message) {
      message.value = localStorage.message;
      localStorage.message = "";
    }
})

const formSchema = toTypedSchema(
  z.object({
    email: z
      .string()
      .min(1, 'Username must be at least 1 characters.')
      .max(50, 'Username must be at most 50 characters.')
      .regex(
        /^\w+$/,
        'Username can only contain letters, numbers, and underscores.',
      ),
    password: z
      .string()
      .min(1, 'Username must be at least 1 characters.')
      .max(50, 'Username must be at most 50 characters.')
  }),
)

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    email: '',
    password: ''
  },
})

const onSubmit = handleSubmit((data) => {
  console.log('onsubmit-----')
})
</script>

<template>
  <h2 class="text-center pt-16" v-if="message">{{ message }}</h2>
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