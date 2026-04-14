"use client";

import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription, Chip } from "@heroui/react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-8 dark:bg-black">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>HeroUI + Next.js</CardTitle>
            <Chip color="success" size="sm" variant="soft">
              v3
            </Chip>
          </div>
          <CardDescription>
            HeroUI está funcionando correctamente en tu proyecto.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Chip color="accent" variant="soft">React 19</Chip>
            <Chip color="success" variant="soft">Tailwind v4</Chip>
            <Chip color="warning" variant="soft">Next.js 16</Chip>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button variant="primary">Primario</Button>
          <Button variant="outline">Secundario</Button>
          <Button variant="danger">Danger</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
