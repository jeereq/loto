"use client"

import { useState } from "react"
import { Dices, Coins, History, TrendingUp, TrendingDown, PiggyBank } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { LotoNumber } from "./loto-number"
import { motion } from "framer-motion"
import { ResultDialog } from "./result-dialog"
import { formatCurrency } from "@/lib/utils"

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

export function LotoGenerator() {
  const [numberCount, setNumberCount] = useState<number>(6)
  const [maxNumber, setMaxNumber] = useState<number>(49)
  const [bet, setBet] = useState<number>(2)
  const [currentNumbers, setCurrentNumbers] = useState<number[]>([])
  const [history, setHistory] = useState<Draw[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedDraw, setSelectedDraw] = useState<Draw | null>(null)
  const { toast } = useToast()

  const totalGains = history.reduce((acc, draw) => {
    if (draw.result) {
      return acc + (draw.result.isWin ? draw.result.gain : -draw.bet)
    }
    return acc
  }, 0)

  const generateNumbers = async () => {
    setIsGenerating(true)
    setCurrentNumbers([])

    const numbers: number[] = []
    const finalNumbers: number[] = []

    while (numbers.length < numberCount) {
      const num = Math.floor(Math.random() * maxNumber) + 1
      if (!numbers.includes(num)) {
        numbers.push(num)
        finalNumbers.push(num)
        setCurrentNumbers([...numbers])
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    finalNumbers.sort((a, b) => a - b)
    setCurrentNumbers(finalNumbers)

    const newDraw: Draw = {
      id: crypto.randomUUID(),
      numbers: finalNumbers,
      bet,
      timestamp: new Date()
    }
    setHistory([newDraw, ...history])

    toast({
      title: "Tirage effectué !",
      description: `Vos numéros: ${finalNumbers.join(", ")}`,
    })

    setIsGenerating(false)
  }

  const handleResultSubmit = (drawId: string, gain: number, isWin: boolean) => {
    setHistory(history.map(draw =>
      draw.id == drawId
        ? { ...draw, result: { gain, isWin } }
        : draw
    ))

    toast({
      title: isWin ? "Gain enregistré !" : "Perte enregistrée",
      description: isWin
        ? `Félicitations ! Vous avez gagné ${formatCurrency(gain)}`
        : `Vous avez perdu votre mise de ${formatCurrency(bet)}`,
      variant: isWin ? "default" : "destructive",
    })
  }

  return (
    <Tabs defaultValue="generator" className="w-full max-w-3xl mx-auto">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="generator">
          <Dices className={`mr-2 h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} /> Générateur
        </TabsTrigger>
        <TabsTrigger value="history">     <History className="mr-2 h-5 w-5" /> Historique </TabsTrigger>
        <TabsTrigger value="stats">     <PiggyBank className="mr-2 h-5 w-5" /> Statistiques</TabsTrigger>
      </TabsList>

      <TabsContent value="generator">
        <Card className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="numberCount">Nombre de numéros à générer</Label>
              <Input
                id="numberCount"
                type="number"
                min="1"
                max={maxNumber}
                value={numberCount}
                onChange={(e) => setNumberCount(Number(e.target.value))}
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxNumber">Nombre maximum</Label>
              <Input
                id="maxNumber"
                type="number"
                min={numberCount}
                value={maxNumber}
                onChange={(e) => setMaxNumber(Number(e.target.value))}
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bet">Mise (€)</Label>
              <Input
                id="bet"
                type="number"
                min="1"
                step="0.5"
                value={bet}
                onChange={(e) => setBet(Number(e.target.value))}
                disabled={isGenerating}
              />
            </div>

            <Button
              onClick={generateNumbers}
              className="w-full"
              size="lg"
              disabled={isGenerating}
            >
              <Dices className={`mr-2 h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Génération en cours...' : 'Générer les numéros'}
            </Button>

            {currentNumbers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-muted rounded-lg"
              >
                <h3 className="font-semibold mb-2">Vos numéros:</h3>
                <div className="flex flex-wrap gap-2">
                  {currentNumbers.map((num, idx) => (
                    <LotoNumber
                      key={`${num}-${idx}`}
                      number={num}
                      delay={idx * 0.2}
                    />
                  ))}
                </div>
                <div className="mt-4 flex items-center text-muted-foreground">
                  <Coins className="mr-2 h-4 w-4" />
                  <span>Mise: {formatCurrency(bet)}</span>
                </div>
              </motion.div>
            )}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="history">
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center">
              <History className="mr-2 h-5 w-5" />
              Historique des tirages
            </h2>
            {history.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Aucun tirage effectué
              </p>
            ) : (
              <div className="space-y-4">
                {history.map((draw) => (
                  <motion.div
                    key={draw.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex flex-wrap gap-2">
                      {draw.numbers.map((num, numIdx) => (
                        <LotoNumber
                          key={`${num}-${numIdx}`}
                          number={num}
                          delay={0}
                          size="sm"
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="text-muted-foreground">
                          Mise: {formatCurrency(draw.bet)}
                        </span>
                        {draw.result && (
                          <span className={draw.result.isWin ? "text-green-500" : "text-red-500"}>
                            {draw.result.isWin ? (
                              <span className="flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                +{formatCurrency(draw.result.gain)}
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <TrendingDown className="w-4 h-4 mr-1" />
                                -{formatCurrency(draw.bet)}
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-muted-foreground">
                          {new Date(draw.timestamp).toLocaleString()}
                        </span>
                        {!draw.result && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDraw(draw)}
                          >
                            Ajouter résultat
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="stats">
        <Card className="p-6">
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center">
              <PiggyBank className="mr-2 h-5 w-5" />
              Bilan des gains/pertes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground">Total des tirages</h3>
                <p className="text-2xl font-bold">{history.length}</p>
              </Card>

              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground">Tirages gagnants</h3>
                <p className="text-2xl font-bold text-green-500">
                  {history.filter(draw => draw.result?.isWin).length}
                </p>
              </Card>

              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground">Tirages perdants</h3>
                <p className="text-2xl font-bold text-red-500">
                  {history.filter(draw => draw.result && !draw.result.isWin).length}
                </p>
              </Card>
            </div>

            <Card className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Bilan total</h3>
              <p className={`text-3xl font-bold ${totalGains >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {totalGains >= 0 ? '+' : ''}{formatCurrency(totalGains)}
              </p>
            </Card>
          </div>
        </Card>
      </TabsContent>

      <ResultDialog
        draw={selectedDraw}
        onClose={() => setSelectedDraw(null)}
        onSubmit={handleResultSubmit}
      />
    </Tabs>
  )
}