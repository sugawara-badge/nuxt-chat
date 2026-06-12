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

const formSchema = toTypedSchema(
  z.object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters.')
      .max(10, 'Username must be at most 10 characters.')
      .regex(
        /^\w+$/,
        'Username can only contain letters, numbers, and underscores.',
      ),
  }),
)

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    username: '',
  },
})

const onSubmit = handleSubmit((data) => {
  // toast('You submitted the following values:', {
  //   description: h('pre', { class: 'bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4' }, h('code', JSON.stringify(data, null, 2))),
  //   position: 'bottom-right',
  //   class: 'flex flex-col gap-2',
  //   style: {
  //     '--border-radius': 'calc(var(--radius)  + 4px)',
  //   },
  // })
})
</script>

<template>
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
          <VeeField v-slot="{ field, errors }" name="username">
            <Field :data-invalid="!!errors.length">
              <!-- <FieldLabel for="form-vee-input-username">
              </FieldLabel> -->
              <Input
                id="form-vee-input-username"
                v-bind="field"
                :aria-invalid="!!errors.length"
                placeholder="Email"
                autocomplete="email"
              />
              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField>
          <VeeField v-slot="{ field, errors }" name="username">
            <Field :data-invalid="!!errors.length">
              <!-- <FieldLabel for="form-vee-input-username">
              </FieldLabel> -->
              <Input
                id="form-vee-input-username"
                v-bind="field"
                :aria-invalid="!!errors.length"
                placeholder="Password"
                autocomplete="email"
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
</template>