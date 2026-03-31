import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CASE_STUDIES } from '@/data/mockData';
import { TrendingUp, Users, Award } from 'lucide-react';

export default function CaseStudySection() {
  return (
    <section id="case-studies" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real results from real clients. See how we've helped businesses transform their operations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {CASE_STUDIES.map((study) => (
            <Card key={study.id} className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <CardTitle className="text-xl">{study.client}</CardTitle>
                  <Badge variant="secondary">{study.industry}</Badge>
                </div>
                <CardDescription className="text-base">
                  {study.challenge}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Solution:</h4>
                  <p className="text-muted-foreground text-sm">{study.solution}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {study.results.map((result, index) => (
                    <div key={index} className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-2xl font-bold text-primary">{result.value}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{result.metric}</p>
                    </div>
                  ))}
                </div>

                {study.testimonial && (
                  <div className="border-t pt-4">
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <blockquote className="text-sm italic text-muted-foreground">
                        "{study.testimonial}"
                      </blockquote>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Award className="w-3 h-3" />
                      <span>Verified Client</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}