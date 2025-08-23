import { X, SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Badge } from './ui/badge';
import { categories, sizes, colors } from '../data/mockProducts';

export interface FilterState {
  categories: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  condition: string[];
  inStock: boolean;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  className?: string;
}

export function ProductFilters({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  className = "" 
}: ProductFiltersProps) {
  const updateFilter = <K extends keyof FilterState>(
    key: K, 
    value: FilterState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'categories' | 'sizes' | 'colors' | 'condition', value: string) => {
    const currentValues = filters[key];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    updateFilter(key, newValues);
  };

  const getActiveFiltersCount = () => {
    return (
      filters.categories.length +
      filters.sizes.length +
      filters.colors.length +
      filters.condition.length +
      (filters.priceRange[0] > 0 || filters.priceRange[1] < 500 ? 1 : 0) +
      (filters.inStock ? 1 : 0)
    );
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="h-8 px-2"
            >
              <X className="w-4 h-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Categorias */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="font-medium">Categoria</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-3">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={() => toggleArrayFilter('categories', category)}
                />
                <Label htmlFor={`category-${category}`} className="capitalize text-sm">
                  {category}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Preço */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="font-medium">Preço</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
              max={500}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>R$ {filters.priceRange[0]}</span>
              <span>R$ {filters.priceRange[1]}</span>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Tamanhos */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="font-medium">Tamanho</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size) => (
                <Button
                  key={size}
                  variant={filters.sizes.includes(size) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleArrayFilter('sizes', size)}
                  className="h-8"
                >
                  {size}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Cores */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="font-medium">Cor</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-3">
            {colors.map((color) => (
              <div key={color} className="flex items-center space-x-2">
                <Checkbox
                  id={`color-${color}`}
                  checked={filters.colors.includes(color)}
                  onCheckedChange={() => toggleArrayFilter('colors', color)}
                />
                <Label htmlFor={`color-${color}`} className="text-sm">
                  {color}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Condição */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="font-medium">Condição</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-3">
            {[
              { value: 'new', label: 'Novo' },
              { value: 'excellent', label: 'Semi-novo' },
              { value: 'used', label: 'Usado' }
            ].map((condition) => (
              <div key={condition.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`condition-${condition.value}`}
                  checked={filters.condition.includes(condition.value)}
                  onCheckedChange={() => toggleArrayFilter('condition', condition.value)}
                />
                <Label htmlFor={`condition-${condition.value}`} className="text-sm">
                  {condition.label}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Apenas em estoque */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={filters.inStock}
            onCheckedChange={(checked) => updateFilter('inStock', checked as boolean)}
          />
          <Label htmlFor="in-stock" className="text-sm">
            Apenas em estoque
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}