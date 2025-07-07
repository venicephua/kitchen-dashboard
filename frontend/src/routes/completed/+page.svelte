<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import OrderList from "$lib/OrderList.svelte";
  import {
    visibleOrdersStore,
    ordersActions,
    type Order,
  } from "$lib/stores/orders";

  // Accept SSR data
  export let data: { orders: Order[] };

  $: completedOrders = $visibleOrdersStore.filter((o: Order) => o.isCompleted);

  let eventSource: EventSource | null = null;

  async function handleUpdateOrder(
    orderId: number,
    orderStatus: "Pending" | "Received" | "Completed"
  ) {
    await ordersActions.updateOrder(orderId, orderStatus);
  }

  function handleHideOrder(orderId: number) {
    if (confirm("Delete order from view?")) {
      ordersActions.hideOrder(orderId);
    }
  }

  onMount(() => {
    if ($visibleOrdersStore.length === 0 && data.orders?.length > 0) {
      ordersActions.initialize(data.orders);
    }

    // Setup SSE connection
    eventSource = new EventSource("/api/orders/stream");

    eventSource.onmessage = (event) => {
      try {
        const orderUpdate = JSON.parse(event.data);
        ordersActions.handleOrderUpdate(orderUpdate);
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      setTimeout(() => {
        if (eventSource?.readyState === EventSource.CLOSED) {
          eventSource = new EventSource("/api/orders/stream");
        }
      }, 5000);
    };
  });

  onDestroy(() => {
    if (eventSource) {
      eventSource.close();
    }
  });
</script>

<main>
  <div class="orders-container">
    <div class="order-list-title">
      <h2>Completed Orders</h2>
      <span class="twemoji--cooking"></span>
    </div>
    <OrderList orders={completedOrders} {handleUpdateOrder} {handleHideOrder} />
  </div>
</main>
