"use server";

export async function updateEdgeConfig(key: string, value: string) {
try {
    const updateEdgeConfig = await fetch(
      `https://api.vercel.com/v1/edge-config/ecfg_0nleybvlnb0xnqnsylefcbfl29mw/items`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              operation: 'update',
              key: key,
              value: value,
            },
          ],
        }),
      },
    );
    const result = await updateEdgeConfig.json();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}