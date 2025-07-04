<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import OrderList from "$lib/OrderList.svelte";
  import { ordersStore, ordersActions, type Order } from '$lib/stores/orders';

  // Accept SSR data
  export let data: { orders: Order[] };

  // Access the store to get pending orders - automatically updates when store changes
  $: pendingOrders = $ordersStore.filter((o: Order) => !o.isCompleted);
  let eventSource: EventSource | null = null;

  async function handleUpdateOrder(orderId: number, orderStatus: "Pending" | "Received" | "Completed") {
    await ordersActions.updateOrder(orderId, orderStatus);
  }

  onMount(() => {
    // Initialize store with SSR data if not already done
    if ($ordersStore.length === 0 && data.orders?.length > 0) {
      ordersActions.initialize(data.orders);
    }
    
    // Setup SSE connection
    eventSource = new EventSource('/api/orders/stream');
    
    eventSource.onmessage = (event) => {
      try {
        const orderUpdate = JSON.parse(event.data);
        ordersActions.handleOrderUpdate(orderUpdate);
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      // Optionally reconnect after a delay
      setTimeout(() => {
        if (eventSource?.readyState === EventSource.CLOSED) {
          eventSource = new EventSource('/api/orders/stream');
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
      <h2>Pending Orders</h2>
      <span class="svg-spinners--gooey-balls-2"></span>
    </div>
    
    <OrderList
      orders={pendingOrders}
      {handleUpdateOrder}
    />
  </div>
</main>
