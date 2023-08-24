import { Check, ChevronDown } from '@teable-group/icons';
import { useRef, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  cn,
  CommandGroup,
  CommandInput,
  Command,
  CommandEmpty,
  CommandItem,
} from '../../shadcn';

export interface ISelectorItem {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

export type ISelectorProps<T = ISelectorItem> = {
  className?: string;
  selectedId?: string;
  placeholder?: string;
  searchTip?: string;
  emptyTip?: string;
  defaultName?: string;
  candidates?: T[];
  onChange?: (id: string) => void;
};

export const Selector: React.FC<ISelectorProps> = ({
  onChange,
  selectedId = '',
  placeholder,
  searchTip = 'Search...',
  emptyTip = 'No found.',
  defaultName = 'Untitled',
  className,
  candidates = [],
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  const selected = candidates.find(({ id }) => id === selectedId);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          disabled={!candidates.length}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('flex gap-2 font-normal px-4', className)}
        >
          {selected ? (
            <>
              {selected.icon} <span className="shrink-0">{selected.name}</span>
            </>
          ) : (
            <span className="shrink-0">{placeholder}</span>
          )}
          <div className="grow"></div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" style={{ minWidth: ref.current?.offsetWidth }}>
        <Command
          filter={(value, search) => {
            // cmdk bugs value is always lowercase, sucks...
            const item = candidates.find(({ id }) => id.toLowerCase() === value);
            const text = item?.name || item?.id;
            if (text?.toLocaleLowerCase().includes(search.toLocaleLowerCase())) return 1;
            return 0;
          }}
        >
          <CommandInput placeholder={searchTip} />
          <CommandEmpty>{emptyTip}</CommandEmpty>
          <CommandGroup>
            {candidates.map(({ id, name, icon }) => (
              <CommandItem
                key={id}
                value={id}
                onSelect={() => {
                  onChange?.(id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn('mr-2 h-4 w-4', id === selectedId ? 'opacity-100' : 'opacity-0')}
                />
                {icon} <span className="ml-2">{name ? name : defaultName}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};