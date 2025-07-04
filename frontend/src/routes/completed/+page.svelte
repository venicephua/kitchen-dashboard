<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import OrderList from "$lib/OrderList.svelte";
  import { ordersStore, ordersActions, type Order } from '$lib/stores/orders';

  // Accept SSR data
  export let data: { orders: Order[] };

  $: completedOrders = $ordersStore.filter((o: Order) => o.isCompleted);

  let interval: ReturnType<typeof setInterval>;

  async function handleUpdateOrder(orderId: number, orderStatus: "Pending" | "Received" | "Completed") {
    await ordersActions.updateOrder(orderId, orderStatus);
  }

  onMount(() => {
     // Initialize store with SSR data if not already done
     if ($ordersStore.length === 0 && data.orders?.length > 0) {
      ordersActions.initialize(data.orders);
    }

     // Start polling for real-time updates
    interval = setInterval(ordersActions.refresh, 2000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<main>
  <div class="orders-container">
    <div class="order-list-title">
      <h2>Completed Orders</h2>
      <span class="twemoji--cooking"></span>
    </div>
    <OrderList
      orders={completedOrders}
      {handleUpdateOrder}
    />
  </div>
</main>