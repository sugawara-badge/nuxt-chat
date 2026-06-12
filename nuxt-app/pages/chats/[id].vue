<script setup lang="ts">
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field'

const onSubmit = () => {
  console.log('onsubmit-----')
}
</script>

<template>
  <div class="chat">
    <h2 class="text-xl pt-4 pb-4">チャット</h2>
    <ul>
      <li>こんにちは</li>
      <li>こんばんは</li>
    </ul>
  </div>

  <Card class="w-full sm:max-w-md">
    <!-- <CardHeader>
      <CardTitle>Bug Report</CardTitle>
      <CardDescription>
        Help us improve by reporting bugs you encounter.
      </CardDescription>
    </CardHeader> -->
    <CardContent>
      <form id="form-vee-demo" @submit="onSubmit">
        <FieldGroup>
          <VeeField v-slot="{ field, errors }" name="title">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="form-vee-demo-title">
                メッセージを送信する
              </FieldLabel>
              <Input
                id="form-vee-demo-title"
                v-bind="field"
                placeholder="Input Message"
                autocomplete="off"
                :aria-invalid="!!errors.length"
              />
              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField>
          <!-- <VeeField v-slot="{ field, errors }" name="description">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="form-vee-demo-description">
                Description
              </FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  id="form-vee-demo-description"
                  v-bind="field"
                  placeholder="I'm having an issue with the login button on mobile."
                  :rows="6"
                  class="min-h-24 resize-none"
                  :aria-invalid="!!errors.length"
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText class="tabular-nums">
                    {{ field.value?.length || 0 }}/100 characters
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                Include steps to reproduce, expected behavior, and what actually
                happened.
              </FieldDescription>
              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField> -->
        </FieldGroup>
      </form>
    </CardContent>

    <CardFooter>
      <Field orientation="horizontal">
        <Button type="button" variant="outline" @click="resetForm">
          Reset
        </Button>
        <Button type="submit" form="form-vee-demo">
          Submit
        </Button>
      </Field>
    </CardFooter>
  </Card>
</template>