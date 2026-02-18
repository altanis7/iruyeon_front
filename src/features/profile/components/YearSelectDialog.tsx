import { useState, useEffect } from "react";
import Picker from "react-mobile-picker";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetFooter,
} from "@/shared/components/ui/bottom-sheet";
import { Button } from "@/shared/components/ui/button";
import { calculateAge } from "../api/profileApi";

interface YearSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  selectedYear?: number;
  onConfirm: (year: number) => void;
  minAge?: number;
  maxAge?: number;
}

export function YearSelectDialog({
  open,
  onOpenChange,
  title,
  selectedYear,
  onConfirm,
  minAge = 20,
  maxAge = 50,
}: YearSelectDialogProps) {
  const currentYear = new Date().getFullYear();
  const minBirthYear = currentYear - maxAge;
  const maxBirthYear = currentYear - minAge;

  const years: string[] = [];
  for (let year = maxBirthYear; year >= minBirthYear; year--) {
    years.push(String(year));
  }

  const defaultYear = String(
    selectedYear || Math.floor((maxBirthYear + minBirthYear) / 2)
  );

  const [pickerValue, setPickerValue] = useState<{ year: string }>({
    year: defaultYear,
  });

  useEffect(() => {
    if (open) {
      setPickerValue({
        year: String(selectedYear || Math.floor((maxBirthYear + minBirthYear) / 2)),
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedYear]);

  const handleConfirm = () => {
    onConfirm(Number(pickerValue.year));
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetTitle className="text-center text-lg font-semibold text-red-500">
            {title}
          </BottomSheetTitle>
          <p className="text-center text-sm text-gray-600 mt-2">
            {pickerValue.year}년생 ({calculateAge(Number(pickerValue.year))}세)
          </p>
        </BottomSheetHeader>

        <div className="py-4">
          <Picker
            value={pickerValue}
            onChange={setPickerValue}
            wheelMode="natural"
          >
            <Picker.Column name="year">
              {years.map(year => (
                <Picker.Item key={year} value={year}>
                  {({ selected }) => (
                    <div
                      className={
                        selected ? "font-semibold text-black" : "text-neutral-400"
                      }
                    >
                      {year}년
                    </div>
                  )}
                </Picker.Item>
              ))}
            </Picker.Column>
          </Picker>
        </div>

        <BottomSheetFooter className="flex flex-col gap-2 pt-2">
          <Button
            type="button"
            onClick={handleConfirm}
            className="w-full h-12 rounded-full text-base font-semibold bg-pink-500 hover:bg-pink-600 text-white"
          >
            확인
          </Button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-full h-10 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            취소
          </button>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
}
