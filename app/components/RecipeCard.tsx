"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MoreVertical, Edit, Trash2, Clock, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Recipe } from "@/services/recipeService";

interface RecipeCardProps {
  recipe: Recipe;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}

export default function RecipeCard({ recipe, onDelete, onRename }: RecipeCardProps) {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newName, setNewName] = useState(recipe.title);

  const handleRename = () => {
    onRename(recipe.id, newName);
    setIsRenameOpen(false);
  };

  const handleDelete = () => {
    onDelete(recipe.id);
    setIsDeleteOpen(false);
  };

  return (
    <>
      <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }} className="group">
        <Card className="overflow-hidden hover:shadow-lg transition shaduration-200">
          <div className="relative">
            <Link href={`/recipe-details/${recipe.id}`}>
              <Image
                src="/placeholder.svg"
                alt={recipe.title}
                width={400}
                height={250}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </Link>
            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white/90 backdrop-blur-sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsRenameOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <CardContent className="p-4">
            <Link href={`/recipe-details/${recipe.id}`}>
              <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">{recipe.title}</h3>
            </Link>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{recipe.instructions}</p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{recipe.createdAt.toLocaleDateString()}</span>
              </div>
              <span className="px-2 py-1 bg-secondary rounded-full text-xs">{recipe.cuisine}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Rename Dialog */}
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Recipe</DialogTitle>
            <DialogDescription>Enter a new name for your recipe.</DialogDescription>
          </DialogHeader>
          <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Recipe name" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Recipe</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{recipe.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}