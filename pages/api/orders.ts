import { prisma } from "@/util/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const user = await getServerSession(req, res, authOptions);
      if (!user) {
        res.status(403).json({ message: "Not logged in" });
      }
      const orders = await prisma.order.findMany({
        where: {
          userId: user?.user?.id,
        },
        include: {
          products: true,
        },
      });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end("Method Not Allowed");
  }
}
