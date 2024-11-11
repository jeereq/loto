"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface Draw {
  id: string;
  numbers: number[];
  bet: number;
  timestamp: Date;
  result?: {
    gain: number;
    isWin: boolean;
  };
}

interface ResultDialogProps {
  draw: Draw | null;
  onClose: () => void;
  onSubmit: (drawId: string, gain: number, isWin: boolean) => void;
}

export function ResultDialog({ draw, onClose, onSubmit }: ResultDialogProps) {
  const [result, setResult] = useState<"win" | "loss">("loss")
  const [gain, setGain] = useState<number>(0)

  const handleSubmit = () => {
    if (draw) {
      onSubmit(draw.id, gain, result === "win")
      onClose()
      setResult("loss")
      setGain(0)
    }
  }

  return (
    <Dialog open={!!draw} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter le résultat du tirage</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <RadioGroup
            value={result}
            onValueChange={(value) => setResult(value as "win" | "loss")}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="win" id="win" />
              <Label htmlFor="win">Gagné</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="loss" id="loss" />
              <Label htmlFor="loss">Perdu</Label>
            </div>
          </RadioGroup>

          {result === "win" && (
            <div className="space-y-2">
              <Label htmlFor="gain">Montant gagné (€)</Label>
              <Input
                id="gain"
                type="number"
                min="0"
                step="0.01"
                value={gain}
                onChange={(e) => setGain(Number(e.target.value))}
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              Enregistrer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}