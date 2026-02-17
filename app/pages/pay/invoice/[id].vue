<template>
  <GeneralLoader v-if="isLoading" />
  <div v-else>
    <div
      ref="printSection"
      class="print-only max-w-4xl mx-auto p-6 bg-white text-slate-500 shadow-md my-10 border rounded"
      v-if="invoice"
    >
      <!-- Header -->
      <div class="border-b pb-8 mb-8 flex items-center">
        <div class="flex-1 text-left">
          <img
            src="/images/logo/b-user-logo.png"
            alt="Clereview"
            class="h-20 w-auto mr-4"
          />
        </div>
        <div
          class="text-4xl font-bold uppercase flex-1 text-right"
          :style="{ color: invoice?.payload.color }"
        >
          {{ invoice?.status }}
        </div>
      </div>

      <div class="pb-4 mb-4 flex items-start">
        <!-- Customer Information -->
        <div class="mb-4">
          <div class="font-bold">Bill To:</div>
          <p class="text-slate-600">{{ invoice?.payload.name }}</p>
          <p class="text-sm text-slate-500">{{ invoice?.payload.address }}</p>
          <p class="text-sm text-slate-500 lowercase">
            {{ invoice?.payload.email }}
          </p>
        </div>

        <!-- Invoice Information -->
        <div class="mb-4 text-right flex-1">
          <p class="text-sm text-slate-500">#{{ invoice?.id }}</p>
          <p class="text-sm text-slate-500">
            Date: {{ invoice?.payload.invoice_date }}
          </p>
          <p class="text-sm text-slate-500">
            Due Date: {{ invoice?.payload.due_date }}
          </p>
        </div>
      </div>

      <!-- Invoice Table -->
      <table class="min-w-full table-auto mb-24">
        <thead>
          <tr class="bg-slate-100">
            <th class="px-4 py-2 text-left font-bold">Description</th>
            <th class="px-4 py-2 text-right font-bold">Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border px-4 py-2">{{ invoice?.payload.description }}</td>
            <td class="border px-4 py-2 text-right">
              {{ moneyFormat(invoice?.payload.payment_amount) }}
            </td>
          </tr>
          <tr>
            <td class="border px-4 py-2">
              {{ invoice?.payload.charges_description }}
            </td>
            <td class="border px-4 py-2 text-right">
              {{ moneyFormat(invoice?.payload.charges_amount) }}
            </td>
          </tr>
          <tr>
            <td colspan="1" class="border px-4 py-2 text-right">Subtotal</td>
            <td class="border px-4 py-2 text-right">
              {{
                moneyFormat(
                  invoice?.payload.payment_amount +
                    invoice?.payload.charges_amount,
                )
              }}
            </td>
          </tr>
          <tr>
            <td colspan="1" class="border px-4 py-2 text-right">Tax (7.5%)</td>
            <td class="border px-4 py-2 text-right">
              {{ moneyFormat(invoice?.payload.vat) }}
            </td>
          </tr>
          <tr class="font-bold">
            <td colspan="1" class="border px-4 py-2 text-right">Total Due</td>
            <td class="border px-4 py-2 text-right">
              {{ moneyFormat(invoice?.payload.total) }}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mb-6"></div>

      <!-- Footer -->
      <div class="text-sm text-slate-500 border-t pt-8 mt-8">
        <div class="text-[120%] font-bold">PLEASE NOTE:</div>
        <div class="mt-2.5">
          <div class="text-[90%]">
            - ALL BANK DEPOSIT OR TRANSFERS DIRECTLY INTO OUR BANK ACCOUNTS ARE
            NOT ALLOWED.
          </div>
          <div class="text-[90%]">
            - ALL INVOICES PAST THE INVOICED DATE ARE VOID, PLEASE CONTACT SALES
            TO GENERATE A NEW INVOICE
          </div>
          <div class="text-[90%]">
            - ANY PAYMENT NOT CONFIRMED WITHIN 12HRS, PLEASE EMAIL
            SUPPORT@CLEREVIEW.COM TO CONFIRM PAYMENT AND AVOID SERVICE
            SUSPENSION/TERMINATION.
          </div>
        </div>
      </div>

      <Divider class="my-[30px]" />

      <div class="flex justify-between gap-2.5 items-center">
        <div>
          <ButtonCustom
            :no-zoom="true"
            label="Print Invoice"
            size="lg"
            @clicked="printQRCode"
          />
        </div>
        <div v-if="invoice?.payload.status === 'UNPAID'">
          <a :href="invoice?.paymentUrl">
            <ButtonCustom
              :no-zoom="true"
              label="Proceed Payment"
              size="lg"
              primary="true"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import usePayments from "~/composables/payment/usePayments";
import type { Invoice } from "~/types/payment";

const { verifyInvoice } = usePayments();
const route = useRoute();
const id = route.params.id as string;
const isLoading = ref(true);
const invoice = ref<Invoice>();

const printSection = ref<HTMLElement | null>(null);
const printQRCode = () => {
  window.print();
};

onBeforeMount(async () => {
  if (!id) {
    throw createError({
      statusCode: 404,
      statusMessage: "Invoice Not Found",
      fatal: true,
    });
  }

  try {
    isLoading.value = true;
    const res = await verifyInvoice(id);
    if (res.ok) {
      return (invoice.value = res.data);
    }

    throw createError({
      statusCode: 404,
      statusMessage: "Invoice Not Found",
      fatal: true,
    });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }

  .print-only,
  .print-only * {
    visibility: visible;
  }

  .print-only {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>
