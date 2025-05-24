import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-red-600">404</CardTitle>
          <h2 className="text-2xl font-semibold">Página Não Encontrada</h2>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-600">
            Desculpe, a página que você está procurando não existe ou foi
            movida.
          </p>
          <Link href="/dashboard">
            <Button variant="default">Voltar para a Página Inicial</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
