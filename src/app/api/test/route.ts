import { getRecipients } from "@/features/admin/services/getRecipients";
import { getUsers } from "@/features/admin/services/getUsers";
import { getWarehouse } from "@/features/admin/services/getWarehouse";

export async function GET() {
  const response = await getWarehouse();
  return new Response(JSON.stringify(response), {
    status: 200,
  });
}
