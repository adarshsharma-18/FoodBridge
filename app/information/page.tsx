import Image from "next/image"
import Link from "next/link"
import { Leaf, Droplets, Flame, BarChart3, Lightbulb, Recycle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function InformationPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            Biogas: Turning Food Waste into Energy
          </h1>
          <p className="text-gray-500 md:text-xl max-w-[800px]">
            Learn how biogas plants work, their environmental benefits, and their role in sustainable development.
          </p>
        </div>

        {/* Introduction Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-green-100 rounded-full -z-10"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-green-50 rounded-full -z-10"></div>
            <div className="relative overflow-hidden rounded-xl shadow-xl">
              <Image
                src="/images/biogas-plant.jpg"
                alt="Biogas plant facility"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
              What is Biogas?
            </div>
            <h2 className="text-3xl font-bold tracking-tighter">A Renewable Energy Source</h2>
            <p className="text-gray-600 leading-relaxed">
              Biogas is a renewable energy source produced by the breakdown of organic matter in the absence of oxygen.
              This process, known as anaerobic digestion, occurs in biogas plants where microorganisms convert organic
              waste like food scraps, agricultural residues, and animal manure into biogas.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The resulting biogas is primarily composed of methane (50-75%) and carbon dioxide (25-50%), with small
              amounts of other gases. This methane-rich gas can be used for cooking, heating, electricity generation,
              and even as vehicle fuel when purified.
            </p>
          </div>
        </div>

        {/* How Biogas Plants Work */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">
              The Process
            </div>
            <h2 className="text-3xl font-bold tracking-tighter mb-4">How Biogas Plants Work</h2>
            <p className="text-gray-500 md:text-xl max-w-[800px] mx-auto">
              Understanding the step-by-step process of converting food waste into renewable energy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Droplets className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Collection & Pre-treatment</CardTitle>
                <CardDescription>The first stage of the biogas production process</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      1
                    </span>
                    <span>Organic waste (food waste, agricultural residues, etc.) is collected</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      2
                    </span>
                    <span>Waste is sorted to remove non-biodegradable materials</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      3
                    </span>
                    <span>Organic matter is shredded to increase surface area</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      4
                    </span>
                    <span>Water is added to create a slurry suitable for digestion</span>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Recycle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Anaerobic Digestion</CardTitle>
                <CardDescription>The core biological process that produces biogas</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      1
                    </span>
                    <span>Slurry enters the digester, an oxygen-free chamber</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      2
                    </span>
                    <span>Bacteria break down complex organic compounds</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      3
                    </span>
                    <span>Four stages: hydrolysis, acidogenesis, acetogenesis, and methanogenesis</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      4
                    </span>
                    <span>Process takes 15-30 days depending on temperature and feedstock</span>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Flame className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Gas Collection & Use</CardTitle>
                <CardDescription>Capturing and utilizing the produced biogas</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      1
                    </span>
                    <span>Biogas rises to the top of the digester and is collected</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      2
                    </span>
                    <span>Gas is cleaned to remove impurities like hydrogen sulfide</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      3
                    </span>
                    <span>Biogas can be used directly for cooking or heating</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      4
                    </span>
                    <span>Or converted to electricity using generators</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Biogas Composition */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">
              Composition
            </div>
            <h2 className="text-3xl font-bold tracking-tighter mb-4">What's in Biogas?</h2>
            <p className="text-gray-500 md:text-xl max-w-[800px] mx-auto">
              Understanding the chemical composition of biogas and its properties.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Typical Biogas Composition</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Component
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentage
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Properties
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Methane (CH₄)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">50-75%</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Combustible, energy-rich component</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Carbon Dioxide (CO₂)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">25-50%</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Non-combustible, reduces energy content</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Hydrogen Sulfide (H₂S)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0-3%</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Corrosive, toxic, must be removed</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Hydrogen (H₂)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0-1%</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Combustible</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Nitrogen (N₂)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0-2%</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Inert gas</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Water Vapor (H₂O)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Saturated</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Can cause corrosion when combined with H₂S</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Sustainable Development */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">
              Impact
            </div>
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Biogas and Sustainable Development</h2>
            <p className="text-gray-500 md:text-xl max-w-[800px] mx-auto">
              How biogas plants contribute to multiple sustainable development goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Environmental Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">Reduced Methane Emissions</h4>
                    <p className="text-gray-500 text-sm">
                      Captures methane that would otherwise be released into the atmosphere
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">Waste Reduction</h4>
                    <p className="text-gray-500 text-sm">
                      Diverts organic waste from landfills, reducing environmental impact
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">Reduced Fossil Fuel Use</h4>
                    <p className="text-gray-500 text-sm">Replaces fossil fuels with renewable energy</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Economic Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">Energy Independence</h4>
                    <p className="text-gray-500 text-sm">Reduces reliance on imported energy sources</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">Job Creation</h4>
                    <p className="text-gray-500 text-sm">
                      Creates employment in construction, operation, and maintenance
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">Waste Management Cost Reduction</h4>
                    <p className="text-gray-500 text-sm">Lowers costs associated with waste disposal</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Social Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">Energy Access</h4>
                    <p className="text-gray-500 text-sm">
                      Provides clean energy to communities, especially in rural areas
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">Improved Sanitation</h4>
                    <p className="text-gray-500 text-sm">Better waste management leads to improved public health</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">Educational Opportunities</h4>
                    <p className="text-gray-500 text-sm">Creates learning opportunities about renewable energy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 md:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-lg mb-6">
              Join FoodBridge today and help us reduce food waste while contributing to sustainable energy production.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100" asChild>
                <Link href="/signup">Sign Up Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20" asChild>
                <Link href="/donate">Donate Food</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
