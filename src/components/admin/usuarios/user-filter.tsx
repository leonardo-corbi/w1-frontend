"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, FilterIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface UserFiltersProps {
  filters: {
    status: string;
    dataInicio: string;
    dataFim: string;
  };
  setFilters: (filters: any) => void;
}

export function UserFilters({ filters, setFilters }: UserFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value });
  };

  const handleDateChange = (
    field: "dataInicio" | "dataFim",
    date: Date | undefined
  ) => {
    if (date) {
      setFilters({ ...filters, [field]: format(date, "yyyy-MM-dd") });
    }
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      dataInicio: "",
      dataFim: "",
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={filters.status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[180px] border-w1-gray-light focus:border-w1-green focus:ring-w1-green">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="active">Ativos</SelectItem>
          <SelectItem value="inactive">Inativos</SelectItem>
        </SelectContent>
      </Select>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="border-w1-gray-light hover:bg-w1-gray-light hover:text-w1-dark"
          >
            <FilterIcon className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            <h4 className="font-medium text-w1-dark">Filtros avançados</h4>

            <div className="space-y-2">
              <label className="text-sm text-w1-gray-dark">
                Data de cadastro
              </label>
              <div className="flex gap-2">
                <div className="w-full">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-w1-gray-light"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dataInicio
                          ? format(new Date(filters.dataInicio), "dd/MM/yyyy")
                          : "De"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          filters.dataInicio
                            ? new Date(filters.dataInicio)
                            : undefined
                        }
                        onSelect={(date) =>
                          handleDateChange("dataInicio", date)
                        }
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="w-full">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-w1-gray-light"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dataFim
                          ? format(new Date(filters.dataFim), "dd/MM/yyyy")
                          : "Até"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          filters.dataFim
                            ? new Date(filters.dataFim)
                            : undefined
                        }
                        onSelect={(date) => handleDateChange("dataFim", date)}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="text-w1-gray hover:text-w1-dark"
              >
                Limpar
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                className="bg-w1-green hover:bg-w1-green-dark text-white"
              >
                Aplicar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
