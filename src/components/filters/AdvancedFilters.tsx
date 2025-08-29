import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Filter, X, Calendar, BarChart, Target } from 'lucide-react'
import { format, subDays, subMonths } from 'date-fns'

export interface FilterOptions {
  period: string
  area: string
  minScore: number | null
  maxScore: number | null
  sessionType: string
}

interface AdvancedFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onReset: () => void
}

export function AdvancedFilters({ filters, onFiltersChange, onReset }: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const hasActiveFilters = 
    filters.period !== 'all' ||
    filters.area !== 'all' ||
    filters.minScore !== null ||
    filters.maxScore !== null ||
    filters.sessionType !== 'all'

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.period !== 'all') count++
    if (filters.area !== 'all') count++
    if (filters.minScore !== null) count++
    if (filters.maxScore !== null) count++
    if (filters.sessionType !== 'all') count++
    return count
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <CardTitle>Filtros Avançados</CardTitle>
            {hasActiveFilters && (
              <Badge variant="secondary">
                {getActiveFiltersCount()} aplicado(s)
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Recolher' : 'Expandir'}
          </Button>
        </div>
        <CardDescription>
          Refine sua análise com filtros específicos
        </CardDescription>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Período */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Período
              </Label>
              <Select
                value={filters.period}
                onValueChange={(value) => updateFilter('period', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os períodos</SelectItem>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="3m">Últimos 3 meses</SelectItem>
                  <SelectItem value="6m">Últimos 6 meses</SelectItem>
                  <SelectItem value="1y">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Área */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Área
              </Label>
              <Select
                value={filters.area}
                onValueChange={(value) => updateFilter('area', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as áreas</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="rh">RH</SelectItem>
                  <SelectItem value="educacional">Educacional</SelectItem>
                  <SelectItem value="gestao">Gestão</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Score Mínimo */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                Score Mínimo
              </Label>
              <Input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={filters.minScore || ''}
                onChange={(e) => updateFilter('minScore', e.target.value ? Number(e.target.value) : null)}
                placeholder="0-10"
              />
            </div>

            {/* Score Máximo */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                Score Máximo
              </Label>
              <Input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={filters.maxScore || ''}
                onChange={(e) => updateFilter('maxScore', e.target.value ? Number(e.target.value) : null)}
                placeholder="0-10"
              />
            </div>

            {/* Tipo de Sessão */}
            <div className="space-y-2">
              <Label>Tipo de Sessão</Label>
              <Select
                value={filters.sessionType}
                onValueChange={(value) => updateFilter('sessionType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="regular">Sessões Regulares</SelectItem>
                  <SelectItem value="live">Sessões Live</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filtros ativos */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {filters.period !== 'all' && (
                    <Badge variant="outline" className="gap-1">
                      {filters.period === '7d' && 'Últimos 7 dias'}
                      {filters.period === '30d' && 'Últimos 30 dias'}
                      {filters.period === '3m' && 'Últimos 3 meses'}
                      {filters.period === '6m' && 'Últimos 6 meses'}
                      {filters.period === '1y' && 'Último ano'}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => updateFilter('period', 'all')}
                      />
                    </Badge>
                  )}
                  
                  {filters.area !== 'all' && (
                    <Badge variant="outline" className="gap-1 capitalize">
                      {filters.area}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => updateFilter('area', 'all')}
                      />
                    </Badge>
                  )}
                  
                  {filters.minScore !== null && (
                    <Badge variant="outline" className="gap-1">
                      Score ≥ {filters.minScore}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => updateFilter('minScore', null)}
                      />
                    </Badge>
                  )}
                  
                  {filters.maxScore !== null && (
                    <Badge variant="outline" className="gap-1">
                      Score ≤ {filters.maxScore}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => updateFilter('maxScore', null)}
                      />
                    </Badge>
                  )}
                  
                  {filters.sessionType !== 'all' && (
                    <Badge variant="outline" className="gap-1">
                      {filters.sessionType === 'regular' ? 'Regulares' : 'Live'}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => updateFilter('sessionType', 'all')}
                      />
                    </Badge>
                  )}
                </div>
                
                <Button variant="outline" size="sm" onClick={onReset}>
                  Limpar todos
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}