<script lang="ts">
  import { onMount } from "svelte";
  import OrderList from "$lib/OrderList.svelte";
  import { fetchOrders, updateOrder } from "$lib/api";

  type Item = {
    name: string;
    quantity: number;
  };

  type Order = {
    id: number;
    items: Item[];
    status: "Pending" | "Received" | "Completed";
    isCompleted: boolean;
  };

  let orders: Order[] = [];

  async function refreshOrders() {
    orders = await fetchOrders();
  }

  async function handleUpdateOrder(orderId: number) {
    await updateOrder(orderId);
    await refreshOrders();
    alert(`Order ${orderId} updated successfully!`);
  }

  onMount(refreshOrders);

  onMount(async () => {
    try {
      orders = await fetchOrders();
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  });
</script>

<main>
  <h1>Kitchen Daskboard</h1>
  <div class="orders-container">
    <h2>Pending Orders</h2>
    <OrderList
      orders={orders.filter((o) => !o.isCompleted)}
      {handleUpdateOrder}
    />

    <h2>Completed Orders</h2>
    <OrderList
      orders={orders.filter((o) => o.isCompleted)}
      {handleUpdateOrder}
    />
  </div>
</main>

<style>
  :root {
    background-color: aliceblue;
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
      "Lucida Sans", Arial, sans-serif;
  }
  
  .orders-container {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 20px;
    padding: 20px;
  }

  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
</style>
