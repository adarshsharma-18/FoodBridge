"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PhotoModalProps {
  isOpen: boolean
  onClose: () => void
  photoUrl: string
  alt?: string
}

export function PhotoModal({ isOpen, onClose, photoUrl, alt = "Photo" }: PhotoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-black bg-opacity-30 text-white hover:bg-opacity-50"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="w-full h-full max-h-[80vh] overflow-auto">
            <img src={photoUrl || "/placeholder.svg"} alt={alt} className="w-full h-auto" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
